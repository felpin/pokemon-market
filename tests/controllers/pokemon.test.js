const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const {
  NAME_LENGTH,
  PRICE_MAX_VALUE,
  PRICE_SCALE,
  STOCK_MAX_VALUE,
} = require('../../constants/pokemon');
const pokemonController = require('../../controllers/pokemon');
const pokemonService = require('../../services/pokemon');

chai.use(chaiAsPromised);
chai.should();

describe('[controllers: pokemon]', () => {
  describe('getAll()', () => {
    let pokemonServiceFindAllStub;

    before(() => {
      pokemonServiceFindAllStub = sinon.stub(pokemonService, 'findAll');
      pokemonServiceFindAllStub.callsFake(() => new Promise((resolve) => {
        resolve([]);
      }));
    });

    after(() => {
      pokemonService.findAll.restore();
    });

    it('should call pokemonService.findAll()', () => pokemonController.getAll()
      .then(() => pokemonServiceFindAllStub.calledOnce.should.equal(true)));
  });

  describe('getByName()', () => {
    let pokemonServiceFindByNameStub;

    before(() => {
      pokemonServiceFindByNameStub = sinon.stub(pokemonService, 'findByName');
      pokemonServiceFindByNameStub.callsFake(() => new Promise((resolve) => {
        resolve(null);
      }));
    });

    after(() => {
      pokemonService.findByName.restore();
    });

    it('requires a name', () => pokemonController
      .getByName()
      .should.be.rejected);

    it(`should not exceed ${NAME_LENGTH} characters`, () => pokemonController
      .getByName('a'.repeat(NAME_LENGTH + 1))
      .should.be.rejected);

    it('should call pokemonService.findByName() when name is valid', () => pokemonController
      .getByName('a'.repeat(NAME_LENGTH))
      .then(() => pokemonServiceFindByNameStub.calledOnce.should.equal(true)));
  });

  describe('upsert()', () => {
    let pokemonServiceUpsertStub;

    before(() => {
      pokemonServiceUpsertStub = sinon.stub(pokemonService, 'upsert');
      pokemonServiceUpsertStub.callsFake(() => new Promise((resolve) => {
        resolve(null);
      }));
    });

    after(() => {
      pokemonService.upsert.restore();
    });

    const correctName = 'bulbasaur';
    const correctPrice = 200;
    const correctStock = 20;

    it('requires a pokemon name', () => pokemonController
      .upsert(({ price: correctPrice, stock: correctStock }))
      .should.be.rejected);

    it(`name should not exceed ${NAME_LENGTH} characters`, () => pokemonController
      .upsert({ name: 'a'.repeat(NAME_LENGTH + 1), price: correctPrice, stock: correctStock })
      .should.be.rejected);

    it('requires a pokemon price', () => pokemonController
      .upsert(({ name: correctName, stock: correctStock }))
      .should.be.rejected);

    it('price must not be negative nor zero', () => Promise.all([
      () => pokemonController.upsert({ name: correctName, price: -1, stock: correctStock })
        .should.be.rejected,
      () => pokemonController.upsert({ name: correctName, price: 0, stock: correctStock })
        .should.be.rejected,
    ]));

    it(`price scale must be ${PRICE_SCALE}`, () => pokemonController
      .upsert({ name: correctName, price: 10 ** -(PRICE_SCALE + 1), stock: correctStock })
      .should.be.rejected);

    it(`price cannot exceed ${PRICE_MAX_VALUE}`, () => pokemonController
      .upsert({ name: correctName, price: PRICE_MAX_VALUE + (10 ** -(PRICE_SCALE)) })
      .should.be.rejected);

    it('stock must not be negative nor zero', () => Promise.all([
      () => pokemonController.upsert({ name: correctName, price: correctPrice, stock: -1 })
        .should.be.rejected,
      () => pokemonController.upsert({ name: correctName, price: correctPrice, stock: 0 })
        .should.be.rejected,
    ]));

    it('stock must be an integer', () => pokemonController
      .upsert({ name: correctName, price: correctPrice, stock: 10.5 })
      .should.be.rejected);

    it(`stock cannot exceed ${STOCK_MAX_VALUE}`, () => pokemonController
      .upsert({ name: correctName, price: correctPrice, stock: STOCK_MAX_VALUE + 1 })
      .should.be.rejected);

    it('should call pokemonService.upsert() when pokemon is valid', () => pokemonController
      .upsert({ name: correctName, price: correctPrice, stock: correctStock })
      .then(() => pokemonServiceUpsertStub.calledOnce.should.equal(true)));
  });
});
