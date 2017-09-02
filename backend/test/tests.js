
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
chai.use(chaiHttp);

let server = require('../src/index');

const url = "http://localhost:3000";

describe("check login details ", () => {

    it("bad username bad password", () => {
        //request("")
    });

    it("bad username good password", () => {
        //chai.assert(true === true, "should be true");

    });

});