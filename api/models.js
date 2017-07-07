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
        return knex('Applicant')
            .where({ApplicantId})
            .update({LastName, FirstName, BirthDate, Email, IsWorking, EducationLevelId, EducationLevelFinished, YearsOfExperience, DesiredSalary, SalaryTypeId, ContractTypeId})
            .then(() => ApplicantId);
    }
}

export class Applicants {
    getAll() {
        return knex('Applicant');
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