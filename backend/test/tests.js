
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
chai.use(chaiHttp);

let server = require('../src/index');

const url = "http://localhost:3000";

describe("server starts", () => {

    it("test chai test", async () => {
        chai.assert(true === true, "should be true");

    })

});