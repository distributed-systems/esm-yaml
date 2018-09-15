import parseCST from './cst/parse.mjs'
import createNode from './createNode.mjs'
import YAMLDocument from './Document.mjs'
import { YAMLSemanticError } from './errors.mjs'


const defaultOptions = {
    keepNodeTypes: true,
    keepBlobsInJSON: true,
    tags: null,
    version: '1.2',
}



class Document extends YAMLDocument {
    constructor(options) {
        super(Object.assign({}, defaultOptions, options));
    }
}



function parseAllDocuments(src, options) {
    return parseCST(src).map(cstDoc => new Document(options).parse(cstDoc));
}



function parseDocument(src, options) {
    const cst = parseCST(src);
    const doc = new Document(options).parse(cst[0]);
    
    if (cst.length > 1) {
        const errMsg = 'Source contains multiple documents; please use YAML.parseAllDocuments()';
        doc.errors.unshift(new YAMLSemanticError(cst[1], errMsg));
    }

    return doc;
}



function parse(src, options) {
    const doc = parseDocument(src, options);
    doc.warnings.forEach(warning => console.warn(warning));

    if (doc.errors.length > 0) {
        throw doc.errors[0];
    }

    return doc.toJSON();
}


function stringify(value, options) {
    const doc = new Document(options);
    doc.contents = value;
    return String(doc);
}


export {
    createNode,
    defaultOptions,
    Document,
    parse,
    parseAllDocuments,
    parseCST,
    parseDocument,
    stringify,
};