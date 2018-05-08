"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const buffer_1 = require("./model/buffer");
const document_1 = require("./model/document");
const logger_1 = require("./util/logger");
const unique = require("array-unique");
class Buffers {
    constructor() {
        this.buffers = [];
        this.versions = {};
    }
    createDocument(uri, filetype, content, keywordOption) {
        let version = this.versions[uri];
        version = version ? version + 1 : 1;
        this.versions[uri] = version;
        let doc = new document_1.default(uri, filetype, version, content, keywordOption);
        this.document = doc;
        return doc;
    }
    addBuffer(nvim, bufnr) {
        return __awaiter(this, void 0, void 0, function* () {
            let lines = yield nvim.call('getbufline', [Number(bufnr), 1, '$']);
            let content = lines.join('\n');
            if (/\u0000/.test(content))
                return;
            let keywordOption = yield nvim.call('getbufvar', [Number(bufnr), '&iskeyword']);
            let buf = this.buffers.find(buf => buf.bufnr == bufnr);
            if (buf) {
                buf.setContent(content);
            }
            else {
                this.buffers.push(new buffer_1.default(bufnr, content, keywordOption));
            }
        });
    }
    removeBuffer(bufnr) {
        let idx = this.buffers.findIndex(o => o.bufnr === bufnr);
        if (idx !== -1) {
            this.buffers.splice(idx, 1);
        }
    }
    getWords(bufnr) {
        let words = [];
        for (let buf of this.buffers) {
            if (bufnr === buf.bufnr)
                continue;
            words = words.concat(buf.words);
        }
        return unique(words);
    }
    getBuffer(bufnr) {
        let buf = this.buffers.find(o => o.bufnr == bufnr);
        return buf || null;
    }
    refresh(nvim) {
        return __awaiter(this, void 0, void 0, function* () {
            let bufs = yield nvim.call('complete#util#get_buflist', []);
            this.buffers = [];
            for (let buf of bufs) {
                yield this.addBuffer(nvim, buf.toString());
            }
            logger_1.logger.debug('Buffers refreshed');
        });
    }
}
exports.Buffers = Buffers;
const buffers = new Buffers();
exports.default = buffers;
//# sourceMappingURL=buffers.js.map