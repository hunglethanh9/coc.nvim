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
const source_1 = require("../model/source");
const buffers_1 = require("../buffers");
class Buffer extends source_1.default {
    constructor(nvim) {
        super(nvim, {
            name: 'buffer',
            shortcut: 'B'
        });
    }
    shouldComplete(opt) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.checkFileType(opt.filetype))
                return false;
            let { input } = opt;
            if (input.length === 0)
                return false;
            return true;
        });
    }
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            yield buffers_1.default.refresh(this.nvim);
        });
    }
    doComplete(opt) {
        return __awaiter(this, void 0, void 0, function* () {
            let { bufnr, input } = opt;
            let words = buffers_1.default.getWords(bufnr);
            return {
                items: words.map(word => {
                    return {
                        word,
                        menu: this.menu
                    };
                })
            };
        });
    }
}
exports.default = Buffer;
//# sourceMappingURL=buffer.js.map