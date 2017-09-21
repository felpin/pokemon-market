const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const NotEnoughStockOfPokemonError = require('../../errors/NotEnoughStockOfPokemonError');
const Pokemon = require('../../models/Pokemon');
const service = require('../../services/pokemon');

chai.use(chaiAsPromised);
chai.should();

describe('[services: pokemon]', () => {
  describe('when there is no pokemons', () => {
    before(() => {
      sinon.stub(Pokemon, 'findAll').callsFake(() => new Promise((resolve) => {
        resolve([]);
      }));

      sinon.stub(Pokemon, 'findOne').callsFake(() => new Promise((resolve) => {
        resolve(null);
      }));

      sinon.stub(Pokemon, 'upsert').callsFake(() => new Promise((resolve) => {
        resolve(undefined);
      }));
    });

    after(() => {
      Pokemon.findAll.restore();
      Pokemon.findOne.restore();
      Pokemon.upsert.restore();
    });

    it('finding all pokemons should return an empty array', () => service
      .findAll()
      .should.eventually.deep.equal([]));

    it('finding by name should return null', () => service
      .findByName('SomePokemonName')
      .should.eventually.null);

    it('removing some pokemon from should throw an error', () => service
      .removeFromStock('SomePokemonName')
      .should.be.rejected);

    it('upsert() will return that a pokemon is new', () => service
      .upsert({ name: 'SomePokemon', price: 0, stock: 0 })
      .should.eventually.equal(true));
  });

  describe('when there is a pokemon', () => {
    const pokemon = {
      name: 'bulbasaur',
      price: 500,
      stock: 5,
    };

    before(() => {
      sinon.stub(Pokemon, 'findAll').callsFake(() => new Promise((resolve) => {
        resolve([pokemon]);
      }));

      const pokemonFindOne = sinon.stub(Pokemon, 'findOne');
      pokemonFindOne.callsFake(() => new Promise((resolve) => {
        resolve(undefined);
      }));
      pokemonFindOne.withArgs({ where: { name: pokemon.name } }).returns(new Promise((resolve) => {
        resolve(pokemon);
      }));

      sinon.stub(Pokemon, 'upsert').callsFake(() => new Promise((resolve) => {
        resolve(undefined);
      }));
    });

    after(() => {
      Pokemon.findAll.restore();
      Pokemon.findOne.restore();
      Pokemon.upsert.restore();
    });

    it('findAll() should return a single element array with the pokemon', () => service
      .findAll()
      .should.eventually.deep.equal([pokemon]));

    it('findByName() should return the pokemon if the argument is the pokemon\'s name', () => service
      .findByName(pokemon.name)
      .should.eventually.deep.equal(pokemon));

    it('findByName() should return the pokemon ignoring the name case', () => service
      .findByName(pokemon.name.toUpperCase())
      .should.eventually.deep.equal(pokemon));

    it('findByName() should not return the pokemon if the argument isn\'t the pokemon\'s name', () => service
      .findByName('another name')
      .should.eventually.not.deep.equal(pokemon));

    it('upsert() the pokemon will return that the pokemon is not new', () => service
      .upsert({
        name: pokemon.name,
        price: 600,
        stock: 10,
      })
      .should.eventually.equal(false));
  });

  describe('when there is a pokemon with stock 20', () => {
    const initialStock = 20;
    const pokemon = {
      name: 'pikachu',
      price: 2000,
      stock: initialStock,
      update: () => { },
    };

    before(() => {
      const pokemonFindOne = sinon.stub(Pokemon, 'findOne');
      pokemonFindOne.callsFake(() => new Promise((resolve) => {
        resolve(undefined);
      }));
      pokemonFindOne.withArgs({ where: { name: pokemon.name } }).returns(new Promise((resolve) => {
        resolve(pokemon);
      }));

      sinon.stub(pokemon, 'update').callsFake((object) => {
        if (typeof object.stock === 'number') {
          pokemon.stock = object.stock;
        }
      });
    });

    beforeEach(() => {
      pokemon.stock = initialStock;
    });

    after(() => {
      Pokemon.findOne.restore();
    });

    it('removing 25 units will throw NotEnoughStockOfPokemonError', () => service
      .removeFromStock(pokemon.name, 25)
      .should.be.rejectedWith(NotEnoughStockOfPokemonError));

    it('removing 0 units will leave 20 units available', () => service
      .removeFromStock(pokemon.name, 0)
      .should.eventually.have.property('stock').equal(20));

    it('removing 20 units will leave 0 units available', () => service
      .removeFromStock(pokemon.name, 20)
      .should.eventually.have.property('stock').equal(0));

    it('removing 15 units will leave 5 units available', () => service
      .removeFromStock(pokemon.name, 15)
      .should.eventually.have.property('stock').equal(5));
  });
});
