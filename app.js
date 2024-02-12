import fs from 'fs/promises'

async function dataProcessing(fileName, object) {
    try {
        const data = await fs.readFile(fileName, 'utf-8');
        let key = "";
        let value = "";
        let flag = false;
    
        for (let i = 0; i < data.length; ++i) {
            if (data[i] !== ':') {
                key += data[i];
            } else if (data[i] === ':') {
                i += 2;

                while (data[i] !== '\n') {
                    if (data[i] === '$') {
                        flag = true;
                        ++i; 
                    }
                    if (data[i] !== ',') {
                        value += data[i];
                    }
                    ++i;
                }
             
                if (!key) {
                    console.error("Empty key found in file: ", fileName);
                    continue; 
                } else {
                    if (!object[key]) { 
                        if (flag) {
                            if (Number.isFinite(Number(value))) {
                                value = Number(value);
                                object[key] = value;
                            } else {
                                console.error("Not a valid finite number: ", fileName);
                            }
                        } else {
                            object[key] = value;
                        }
                    }
                } 

                key = ""; 
                value = "";
                flag = false;
            }
        }
    } catch (error) {
        console.error("Error processing file:", fileName, error);
    }
}

const companyAQuarter1 = {};
const companyAQuarter2 = {};
const companyBQuarter1 = {};
const companyBQuarter2 = {};

async function processFiles(company) {   
    if (company === 'A') {
        await dataProcessing('./CompanyA_Quarter1.txt', companyAQuarter1);
        await dataProcessing('./CompanyA_Quarter2.txt', companyAQuarter2);
        console.log("\nAnalysis on Company A's Data:\n");
        await dataAnalysis(companyAQuarter1, companyAQuarter2);
    } else if (company === 'B') {
        await dataProcessing('./CompanyB_Quarter1.txt', companyBQuarter1);
        await dataProcessing('./CompanyB_Quarter2.txt', companyBQuarter2);
        console.log("\nAnalysis on Company B's Data:\n");        
        await dataAnalysis(companyBQuarter1, companyBQuarter2);
    } else {
        throw new Error("The entered company name is incorrect.\nPlease try again.");
    }
}

async function dataAnalysis(obj1, obj2) {
    if (obj1.length !== obj2.length) {
        throw new Error("The data for Q1 and Q2 does not match.\nPlease double-check.");
    }

    let key = 0;
    let valueDiff = 0;

    for (let i = 2; i < Object.keys(obj2).length; ++i) {
        key = Object.keys(obj2)[i];
        valueDiff = obj2[key] - obj1[key];

        console.log(`${key}: ${valueDiff}`);
    }
}

processFiles('A');
processFiles('B')

