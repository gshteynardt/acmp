class JsonVisitor {
    constructor(json) {
        this.json = json;
    }

    removeLocalGroup() {
        const processNode = (obj) => {
            if (typeof obj === 'string' && obj.length >= 2 && obj.startsWith("\"") && obj.endsWith("\"")) {
                return obj.slice(1, -1);
            }

            if (obj === null || typeof obj !== 'object') {
                return obj;
            }

            for (const key in obj) {
                if (key === 'local' && typeof obj[key] === 'object') {
                    return processNode(obj[key]);
                } else {
                    obj[key] = processNode(obj[key]);
                }
            }

            return obj;
        }

        this.json = processNode(this.json);

        return this.json;
    }

    setLocalGroup() {
        const processNode = (obj) => {
            if (typeof obj === 'string' && obj.includes('--')) {
                return `"${obj}"`;
            }

            if (obj === null || typeof obj !== 'object') {
                return obj;
            }

            for (const key in obj) {
                if (key.includes('--') && typeof obj[key] === 'object') {
                    const newObj = {
                        local: { [key]: processNode(obj[key]) },
                    };
                    
                    return newObj;
                } else {
                    obj[key] = processNode(obj[key]);
                }
            }

            return obj;
        }

        this.json = processNode(this.json);

        return this.json;
    }
}

const json = {
    "$and": [
        {
            "$and": [
                {
                    "$and": [
                        {
                            "resolution": {
                                "$eq": "willNotFix"
                            }
                        },
                        {
                            "status": {
                                "$eq": "escalate"
                            }
                        }
                    ]
                },
                {
                    "$and": [
                        {
                            "local": {
                                "603f76827597e02751167b33--locUser": {
                                    "$eq": "\"sborovski--wewe\""
                                }
                            }
                        },
                        {
                            "author": {
                                "$eq": "dyukov"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "$and": [
                {
                    "local": {
                        "603f76827597e02751167b33--locUser": {
                            "$eq": "sborovski"
                        }
                    }
                },
                {
                    "author": {
                        "$eq": "dyukov"
                    }
                }
            ]
        }
    ]
}

const json2 = {
    "$and": [
        {
            "$and": [
                {
                    "$and": [
                        {
                            "resolution": {
                                "$eq": "willNotFix"
                            }
                        },
                        {
                            "status": {
                                "$eq": "escalate"
                            }
                        }
                    ]
                },
                {
                    "$and": [
                        {
                            "603f76827597e02751167b33--locUser": {
                                "$eq": "sborovski--wewe"
                            }
                        },
                        {
                            "author": {
                                "$eq": "dyukov"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "$and": [
                {
                    "603f76827597e02751167b33--locUser": {
                        "$eq": "sborovski"
                    }
                },
                {
                    "author": {
                        "$eq": "dyukov"
                    }
                }
            ]
        }
    ]
}

const jsonVisitor = new JsonVisitor(json);
const jsonWithLocalGroup = jsonVisitor.removeLocalGroup();
console.log(JSON.stringify(jsonWithLocalGroup, null, 2));

const jsonVisitor2 = new JsonVisitor(json2);
console.log(JSON.stringify(jsonVisitor2.setLocalGroup(), null, 2));