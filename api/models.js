import knex from './connector';

export class EducationLevel {
    getAll() {
        return knex('EducationLevel');
    }
    getById(id) {
        return knex('EducationLevel')
            .where({ EducationLevelId: id})
            .then(([row]) => row);
    }
}

export class SalaryType {
    getAll() {
        return knex('SalaryType');
    }
     getById(id) {
        return knex('SalaryType')
            .where({ SalaryTypeId: id})
            .then(([row]) => row);
    }
}

export class ContractType {
    getAll() {
        return knex('ContractType');
    }
    getById(id) {
        return knex('ContractType')
            .where({ ContractTypeId: id})
            .then(([row]) => row);
    }
}

export class TechnicalSkill {
    getAll() {
        return knex('TechnicalSkill');
    }
    getById(id) {
        return knex('TechnicalSkill')
            .where({ TechnicalSkillId: id})
            .then(([row]) => row);
    }
}

export class Applicant {
    getById(ApplicantId) {
        const query = knex('Applicant')
            .where({ApplicantId});
        return query.then(([row]) => row);
    }
    save(ApplicantId, LastName, FirstName, BirthDate, Email, IsWorking, EducationLevelId, EducationLevelFinished, YearsOfExperience, DesiredSalary, SalaryTypeId, ContractTypeId, TechnicalSkillIds) {
        if(ApplicantId > 0) {
            return knex.transaction(trx => {
                 knex('Applicant')
                .where({ApplicantId})
                .update({LastName, FirstName, BirthDate, Email, IsWorking, EducationLevelId, EducationLevelFinished, YearsOfExperience, DesiredSalary, SalaryTypeId, ContractTypeId, ModificationDate: new Date()})
                .then(() => knex('ApplicantTechnicalSkill')
                    .where({ ApplicantId })
                    .del() )
                .then(() => { TechnicalSkillIds.forEach(s => 
                    knex('ApplicantTechnicalSkill')
                    .insert({ ApplicantId, TechnicalSkillId: s })
                    .then(result => ApplicantId));
                    return ApplicantId;
                })
                .then(trx.commit)
                .catch(trx.rollback)
            })
            .then((ApplicantId) => ApplicantId);
            
        }
        else {
            return knex.transaction(trx => {
                knex('Applicant')
                .transacting(trx)
                .insert({ LastName, FirstName, BirthDate, Email, IsWorking, EducationLevelId, EducationLevelFinished, YearsOfExperience, DesiredSalary, SalaryTypeId, ContractTypeId, ModificationDate: new Date(), CreationDate: new Date() })
                .returning('ApplicantId')
                .then(([ApplicantId]) => { TechnicalSkillIds.forEach(s => 
                    knex('ApplicantTechnicalSkill')
                    .insert({ ApplicantId, TechnicalSkillId: s })
                    .then(result => ApplicantId));
                    return ApplicantId;
                })
                .then(trx.commit)
                .catch(trx.rollback)
            })
            .then((ApplicantId) => ApplicantId);
            
        }
    }
    delete(ApplicantId) {
        return knex.transaction(trx => {
            knex('ApplicantTechnicalSkill')
                .transacting(trx)
                .where({ ApplicantId })
                .del()
                .then(() => knex('Applicant')
                    .transacting(trx)
                    .where({ ApplicantId })
                    .del())
                .then(trx.commit)
                .catch(trx.rollback);
        })
        .then(() => true)
        .catch((err) => {
            console.log(err);
            return false;
        });
    }
}

export class Applicants {
    getAll() {
        return knex('Applicant');
    }
    getByPage(page, count) {
        const offset = (page - 1) * count;
        return { 
            Applicants: knex('Applicant').orderBy('LastName').orderBy('FirstName').limit(count).offset(offset),
            TotalCount: knex('Applicant').count('ApplicantId').then(([result]) => parseInt(result.count))
        }
    }
}

export class ApplicantTechnicalSkill {
    getByApplicantId(ApplicantId) {
        return knex.select('TechnicalSkill.*')
            .from('ApplicantTechnicalSkill')
            .innerJoin('TechnicalSkill', 'ApplicantTechnicalSkill.TechnicalSkillId', 'TechnicalSkill.TechnicalSkillId')
            .where({ ApplicantId });
    }
}