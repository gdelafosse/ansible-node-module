'use strict';

require('mocha-sinon');
const expect = require('chai').expect;
const assert = require('chai').assert;
const fs = require('fs');
const tmp = require('tmp');

const ansible = require('./index.js');

let argsFile;

beforeEach(function () {
    const log = console.log;
    this.sinon.stub(console, 'log', function() {
        return log.apply(log, arguments);
    });
    argsFile = tmp.fileSync();
    process.argv[2] = argsFile.name;
});

describe('ansible-node-module', function () {

    it('prints an empty JSON object when the callback doesn\'t return anything', function () {
        return ansible.main(function () {})
            .then(function () {
                expect(console.log.calledOnce).to.be.true;
                expect(console.log.calledWith('{}'), 'main didn\'t print an empty JSON').to.be.true;
            });
    });

    it('prints the object returned by the callback', function () {
        const returned = {any: 'object'};
        return ansible.main(function () {
            return returned;
        }).then(function () {
            expect(console.log.calledOnce).to.be.true;
            expect(console.log.calledWith(JSON.stringify(returned)), 'main didn\'t print the returned object').to.be.true;
        });
    });

    it('provides arguments to the callback', function () {
        fs.writeSync(argsFile.fd, 'arg1="value1" arg2="value2"');
        return ansible.main(function (args) {
            expect(args).to.have.property('arg1', 'value1');
            expect(args).to.have.property('arg2', 'value2');
        });
    });

    it('returns a rejected promise if the callback throws an error', function () {
        return ansible.main(function (args) {
            throw new Error();
        }).then(function () {
            assert(false, 'the returned promise should have been rejected');
        }, function(err) {
            expect(err).to.be.an('error');
        });
    });

    it('prints an object with failed=true if the callback throws an error', function () {
        return ansible.main(function (args) {
            throw new Error();
        }).catch(function () {
            expect(console.log.calledOnce).to.be.true;
            expect(console.log.calledWith('{"failed":true, "msg":""}'), 'main didn\'t print failed').to.be.true;
        });;
    });

    it('prints the error message if the callback throws an error with a message', function () {
        return ansible.main(function (args) {
            throw new Error('message');
        }).catch(function () {
            expect(console.log.calledOnce).to.be.true;
            expect(console.log.calledWith('{"failed":true, "msg":"message"}'), 'main didn\'t print the error message').to.be.true;
        });;
    });
});