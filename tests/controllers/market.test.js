const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const {
  NAME_LENGTH,
  PRICE_MAX_VALUE,
  PRICE_SCALE,
  STOCK_MAX_VALUE,
} = require('../../constants/pokemon');
const marketController = require('../../controllers/market');
const marketService = require('../../services/market');

chai.use(chaiAsPromised);
chai.should();

describe('[controllers: market]', () => {
  describe('buy()', () => {
    let marketServiceBuyStub;

    before(() => {
      marketServiceBuyStub = sinon.stub(marketService, 'buy');
      marketServiceBuyStub.callsFake(() => new Promise((resolve) => {
        resolve([]);
      }));
    });

    after(() => {
      marketService.buy.restore();
    });

    const correctName = 'pikachu';
    const correctQuantity = 10;
    const correctCreditCard = {
      holderName: 'JOAO F FONSECA',
      number: '5318810358492781',
      expirationDate: '1018',
      cvv: '205',
    };

    it('requires a buy request object', () => marketController
      .buy().should.be.rejected);

    it('buyrequest requires a quantity', () => marketController
      .buy({ name: correctName, creditCard: correctCreditCard })
      .should.be.rejected);

    it('buyrequest\'s quantity must not be negative nor zero', () => Promise.all([
      () => marketController.buy({ name: correctName, creditCard: correctCreditCard, quantity: -1 })
        .should.be.rejected,
      () => marketController.buy({ name: correctName, creditCard: correctCreditCard, quantity: 0 })
        .should.be.rejected,
    ]));

    it('buyrequest\'s quantity must be an integer', () => marketController
      .buy({ name: correctName, creditCard: correctCreditCard, quantity: 7.4 })
      .should.be.rejected);

    it('buyrequest requires a name', () => marketController
      .buy({ quantity: correctQuantity, creditCard: correctCreditCard })
      .should.be.rejected);

    it(`buyrequest's name should not exceed ${NAME_LENGTH} characters`, () => marketController
      .buy({ quantity: correctQuantity, name: 'a'.repeat(NAME_LENGTH + 1), creditCard: correctCreditCard })
      .should.be.rejected);

    it('buyrequest requires a credit card', () => marketController
      .buy({ quantity: correctQuantity, name: correctName })
      .should.be.rejected);

    it('buyrequest\'s credit card must have a holder name', () => marketController
      .buy({
        quantity: correctQuantity,
        name: correctName,
        creditCard: {
          number: correctCreditCard.number,
          expirationDate: correctCreditCard.expirationDate,
          cvv: correctCreditCard.cvv,
        },
      })
      .should.be.rejected);

    it('buyrequest\'s credit card must have a number', () => marketController
      .buy({
        quantity: correctQuantity,
        name: correctName,
        creditCard: {
          holderName: correctCreditCard.holderName,
          expirationDate: correctCreditCard.expirationDate,
          cvv: correctCreditCard.cvv,
        },
      })
      .should.be.rejected);

    it('buyrequest\'s credit card number must contain only numbers', () => Promise.all([
      () => marketController.buy({
        quantity: correctQuantity, name: correctName, creditCard: Object.assign({}, correctCreditCard, { number: 'AAAABBBBCCCCDDDD' }),
      }).should.be.rejected,
      () => marketController.buy({
        quantity: correctQuantity, name: correctName, creditCard: Object.assign({}, correctCreditCard, { number: '%%%%&&&&$$$$####' }),
      }).should.be.rejected,
    ]));

    it('buyrequest\'s credit card must have an expiration date', () => marketController
      .buy({
        quantity: correctQuantity,
        name: correctName,
        creditCard: {
          holderName: correctCreditCard.holderName,
          number: correctCreditCard.number,
          cvv: correctCreditCard.cvv,
        },
      })
      .should.be.rejected);

    it('buyrequest\'s credit card expiration date must contain only numbers', () => Promise.all([
      () => marketController.buy({
        quantity: correctQuantity, name: correctName, creditCard: Object.assign({}, correctCreditCard, { expirationDate: '1O19' }),
      }).should.be.rejected,
      () => marketController.buy({
        quantity: correctQuantity, name: correctName, creditCard: Object.assign({}, correctCreditCard, { expirationDate: '1@19' }),
      }).should.be.rejected,
    ]));

    it('buyrequest\'s credit card expiration date must be 4 characters long', () => Promise.all([
      () => marketController.buy({
        quantity: correctQuantity, name: correctName, creditCard: Object.assign({}, correctCreditCard, { expirationDate: '101' }),
      }).should.be.rejected,
      () => marketController.buy({
        quantity: correctQuantity, name: correctName, creditCard: Object.assign({}, correctCreditCard, { expirationDate: '10188' }),
      }).should.be.rejected,
    ]));

    it('buyrequest\'s credit card must have a cvv', () => marketController
      .buy({
        quantity: correctQuantity,
        name: correctName,
        creditCard: {
          holderName: correctCreditCard.holderName,
          number: correctCreditCard.number,
          expirationDate: correctCreditCard.expirationDate,
        },
      })
      .should.be.rejected);

    it('buyrequest\'s credit card cvv must contain only numbers', () => Promise.all([
      () => marketController.buy({
        quantity: correctQuantity, name: correctName, creditCard: Object.assign({}, correctCreditCard, { cvv: 'A12' }),
      }).should.be.rejected,
      () => marketController.buy({
        quantity: correctQuantity, name: correctName, creditCard: Object.assign({}, correctCreditCard, { cvv: '%12' }),
      }).should.be.rejected,
    ]));
  });
});
