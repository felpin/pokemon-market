const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const NotEnoughStockOfPokemonError = require('../../errors/NotEnoughStockOfPokemonError');
const PagarmeTransactionError = require('../../errors/PagarmeTransactionError');
const UnexistentPokemonError = require('../../errors/UnexistentPokemonError');
const UnpaidTransactionError = require('../../errors/UnpaidTransactionError');
const pagarme = require('../../external/pagarme');
const { StatusCodeError } = require('../../node_modules/request-promise-core/lib/errors');
const pokemonService = require('../../services/pokemon');
const service = require('../../services/market');

chai.use(chaiAsPromised);
chai.should();

describe('[services: market]', () => {
  describe('when buying an inexistent pokemon', () => {
    before(() => {
      sinon.stub(pokemonService, 'findByName').callsFake(() => new Promise((resolve) => {
        resolve(null);
      }));
    });

    after(() => {
      pokemonService.findByName.restore();
    });

    it('should throw UnexistentPokemonError', () => service
      .buy('InexistentPokemon', 10, null)
      .should.be.rejectedWith(UnexistentPokemonError));
  });

  describe('when buying more units than available', () => {
    const pokemon = 'pikachu';
    const stock = 20;

    before(() => {
      sinon.stub(pokemonService, 'findByName').callsFake(() => new Promise((resolve) => {
        resolve({ name: pokemon, stock, price: 200 });
      }));
    });

    after(() => {
      pokemonService.findByName.restore();
    });

    it('should throw NotEnoughStockOfPokemonError', () => service
      .buy(pokemon, stock + 5, null)
      .should.be.rejectedWith(NotEnoughStockOfPokemonError));
  });

  describe('when a transaction is done, but it is not paid', () => {
    const pokemon = 'pikachu';
    const stock = 20;

    before(() => {
      sinon.stub(pokemonService, 'findByName').callsFake(() => new Promise((resolve) => {
        resolve({ name: pokemon, stock, price: 200 });
      }));

      sinon.stub(pagarme, 'transaction').callsFake(() => new Promise((resolve) => {
        resolve({ status: 'refused' });
      }));
    });

    after(() => {
      pagarme.transaction.restore();
      pokemonService.findByName.restore();
    });

    it('should throw UnpaidTransactionError', () => service
      .buy(pokemon, stock, {})
      .should.be.rejectedWith(UnpaidTransactionError));
  });

  describe('when there is an error with the transaction', () => {
    const pokemon = 'pikachu';
    const stock = 20;

    before(() => {
      sinon.stub(pokemonService, 'findByName').callsFake(() => new Promise((resolve) => {
        resolve({ name: pokemon, stock, price: 200 });
      }));

      sinon.stub(pagarme, 'transaction').callsFake(() => new Promise((resolve, reject) => {
        reject(new StatusCodeError());
      }));
    });

    after(() => {
      pagarme.transaction.restore();
      pokemonService.findByName.restore();
    });

    it('should throw PagarmeTransactionError', () => service
      .buy(pokemon, stock, {})
      .should.be.rejectedWith(PagarmeTransactionError));
  });

  describe('when a transaction is successful', () => {
    const pokemon = {
      name: 'pikachu',
      stock: 20,
      price: 255,
    };

    let removeFromStockStub;

    before(() => {
      removeFromStockStub = sinon.stub(pokemonService, 'removeFromStock');
      removeFromStockStub.callsFake(() => new Promise((resolve) => {
        resolve(Object.assign({}, pokemon, { stock: 10 }));
      }));

      sinon.stub(pokemonService, 'findByName').callsFake(() => new Promise((resolve) => {
        resolve(pokemon);
      }));

      sinon.stub(pagarme, 'transaction').callsFake(() => new Promise((resolve) => {
        resolve({ status: 'paid' });
      }));
    });

    after(() => {
      pagarme.transaction.restore();
      pokemonService.findByName.restore();
      pokemonService.removeFromStock.restore();
    });

    const quantityBought = 5;
    const successfulTransaction = () => service
      .buy(pokemon.name, quantityBought, {});

    it('should return the pokemon bought', () => successfulTransaction()
      .should.eventually.have.property('name').equal(pokemon.name));

    it('should call removeFromStock() from pokemonService', () => removeFromStockStub
      .withArgs(pokemon.name, quantityBought).calledOnce.should.equal(true));
  });
});
