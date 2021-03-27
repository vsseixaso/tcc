const { makeDb } = require('../db');
const dbConfig = require('../config/db');
const { metadataColumns } = require('../lib/constants');
const utils = require('../lib/utils');


const formatTableMetadata = tableMetadata => {

    let rules = {};

    const getValues = column => {

        const convert = metadata => {
            switch (metadata) {
                case 'COLUMN_DEFAULT':
                    return column[metadata];
                
                case 'IS_NULLABLE':
                    return column[metadata] == 'YES' ? false : true;
                
                case 'DATA_TYPE':
                    return utils.getType(column[metadata]);

                case 'CHARACTER_MAXIMUM_LENGTH':
                    return column[metadata];
                
                case 'NUMERIC_PRECISION':
                    return column[metadata];
                
                case 'NUMERIC_SCALE':
                    return column[metadata];

                case 'DATETIME_PRECISION':
                    return column[metadata];
    
                case 'COLUMN_TYPE':
                    return column[metadata];
        
                case 'COLUMN_COMMENT':
                    return column[metadata];
                   
                default:
                    return column[metadata];
            }
        };

        let obj = {}

        Object.keys(metadataColumns).forEach(key => {
            obj[key] = convert(metadataColumns[key]);
        });

        return obj;
    };
    
    tableMetadata.forEach(column => {
        rules[column['COLUMN_NAME']] = getValues(column);
    });

    return rules;
};

const getTableMetadata = async (schemaName, tableName) => {
    const db = makeDb(dbConfig);

    try {
        const query = utils.generateQuery(schemaName, tableName);
        const tableMetadata = await db.query(query);

        return tableMetadata;
    } catch ( err ) {
        console.error(err);
    } finally {
        await db.close();
    }
};
    
const getRules = async tableName => {
    const schemaName = dbConfig.database;
    const tableMetadata = await getTableMetadata(schemaName, tableName);
    const rules = formatTableMetadata(tableMetadata);
    
    return rules;
};

module.exports = { getRules };