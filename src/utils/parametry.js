export const inputOutputTypes = {
    input: {type: "input", simils: ["input"] },
    output: {type: "output", simils: ["output"]},
    inputOutput: {type: "onput-Output", simils: ["input-output"]}
}


export const requiredTypes = {
    REQUIRED: {type: "REQUIRED", simils: ["required", "yes", "si"] },
    OPTIONAL: {type: "OPTIONAL", simils: ["required", "no"] }
}

export const dataTypes = {
    String: { type: "String", simils: ["string", "alfanumerico"] },
    Number: { type: "Number", simils: ["number","double", "long", "integer", "int", "numerico"] },
    Object: { type: "Object", simils: ["object","object", "dto", "obj"] },
    Array: { type: "Array", simils: ["array", "dto", "obj"] },
    Boolean: { type: "Boolean", simils: ["boolean","bool"] },
    Datetime: { type: "Datetime", simils: ["datetime","date"] }
}

export const template = {
    inputOutput : undefined,
    field: undefined,
    required: undefined,
    type: undefined,
    description: undefined
}