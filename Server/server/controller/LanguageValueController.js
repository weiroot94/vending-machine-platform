const LanguageValue = require("../models/languagevalue");
const logger = require("../logger");

// VM Admin site, customer site, and Vending Machine app will have different
// Language values obviously.

const keysToRole = {
    VMApp: [
        'LANG_KEY_TABCONTINUE',
        'LANG_KEY_BUYNOW',
        'LANG_KEY_BUY',
        'LANG_KEY_STEP_CHOOSEQUANTITY',
        'LANG_KEY_STEP_PAYMENTMETHOD',
        'LANG_KEY_STEP_VERIFICATION',
        'LANG_KEY_STEP_PAYMENTSTATUS',
        'LANG_KEY_PAYMENT_TITLE',
        'LANG_KEY_PAYMENT_ONLINE',
        'LANG_KEY_PAYMENT_CASH',
        'LANG_KEY_QR_TITLE',
        'LANG_KEY_QR_DESCRIPTION',
        'LANG_KEY_CASH_TITLE',
        'LANG_KEY_CASH_INSERTEDMONEY',
        'LANG_KEY_CASH_TOTALAMOUNT',
        'LANG_KEY_VERIFICATION_TITLE',
        'LANG_KEY_VERIFICATION_DESCRIPTION',
        'LANG_KEY_VERIFICATION_FAILED_TITLE',
        'LANG_KEY_VERIFICATION_FAILED_DESCRIPTION',
        'LANG_KEY_VERIFICATION_FAILED_BTN',
        'LANG_KEY_VERIFICATION_SUCCESS_TITLE',
        'LANG_KEY_VERIFICATION_SUCCESS_BTN',
        'LANG_KEY_PURCHASE_FAILED_TITLE',
        'LANG_KEY_PURCHASE_FAILED_DESCRIPTION',
        'LANG_KEY_PURCHASE_FAILED_BTN',
        'LANG_KEY_PURCHASE_SUCCESS_TITLE',
        'LANG_KEY_PURCHASE_SUCCESS_BTN',
        'LANG_KEY_CAUTION_DISPLAYED',
    ],
    VMAdmin: [
        'LANG_KEY_ADMIN_KEY1',
        'LANG_KEY_ADMIN_KEY2',
        'LANG_KEY_ADMIN_KEY3',
        'LANG_KEY_ADMIN_KEY4',
        'LANG_KEY_ADMIN_KEY5',
    ],
    VMCustomer: [
        'LANG_KEY_CUSTOMER_KEY1',
        'LANG_KEY_CUSTOMER_KEY2',
        'LANG_KEY_CUSTOMER_KEY3',
        'LANG_KEY_CUSTOMER_KEY4',
        'LANG_KEY_CUSTOMER_KEY5',
        'LANG_KEY_CUSTOMER_KEY6',
        'LANG_KEY_CUSTOMER_KEY7',
        'LANG_KEY_CUSTOMER_KEY8',
        'LANG_KEY_CUSTOMER_KEY9',
    ],
}


class LanguageValueController {

    static LanguageValueList = async (languageId) => {
        let valueList = await LanguageValue.find({ language_type: languageId });
        return valueList;
    };

    static LanguageValueInit = async (languageId, languageRole) => {
        
        const languageValuesArray = keysToRole[languageRole].map(key => {
            return {
                language_key: key,
                language_value: '',
                language_type: languageId,
            };
        });
        
        LanguageValue.insertMany(languageValuesArray)
        .then(result => {
            return true;
        })
        .catch(error => {
            return false;
        });
    }; 

    static LanguageValuesDelete = async (languageId) => {
        LanguageValue.deleteMany({ language_type: languageId }).then((result) => {
            return true;
        }).catch(error => {
            console.log(error);
            return false;
        });
    };
    
    static LanguageValueAdd = async (values) => {
        LanguageValue.insertMany(values)
        .then(result => {
            return true;
        })
        .catch(error => {
            console.log(error);
            return false;
        });
    };

    static LanguageValueUpdate = async (values) => {
        const bulkUpdateOperations = values.map(value => ({
            updateOne: {
                filter: { _id: value._id },
                update: { $set: value }
            }
        }));

        LanguageValue.bulkWrite(bulkUpdateOperations)
            .then(result => {
                logger.info(`${result.modifiedCount} keys are updated in languagevalues`);
            })
            .catch(error => {
                console.error('Error updating records:', error);
            });
    }

}

module.exports = LanguageValueController;
