import { makeExecutableSchema } from 'graphql-tools';
import { property } from 'lodash';
import dateResolver from './dateResolver';

const schema = [`
scalar Date

type Applicant {
  ApplicantId: Int!
  LastName: String!
  FirstName: String!
  BirthDate: Date
  Age: Int
  Email: String!
  IsWorking: Int!
  EducationLevel: EducationLevel!
  EducationLevelFinished: Int!
  YearsOfExperience: Int!
  DesiredSalary: Int!
  SalaryType: SalaryType!
  ContractType: ContractType!
  TechnicalSkills: [TechnicalSkill]
  CreationDate: Date!
  ModificationDate: Date!
}

type PaginatedApplicants {
  Applicants: [Applicant]
  TotalCount: Int
}

type ContractType {
  ContractTypeId: Int!
  Description: String!
}

type EducationLevel {
  EducationLevelId: Int!
  Description: String!
}

type SalaryType {
  SalaryTypeId: Int!
  Description: String!
}

type TechnicalSkill {
  TechnicalSkillId: Int!
  Description: String!
}

type ApplicantTechnicalSkill {
  ApplicantId: Int!
  TechnicalSkillId: Int!
}

type Query {
  EducationLevels: [EducationLevel]
  ContractTypes: [ContractType]
  SalaryTypes: [SalaryType]
  TechnicalSkills: [TechnicalSkill]
  Applicant(ApplicantId: Int!): Applicant
  PaginatedApplicants(page: Int!, count: Int!): PaginatedApplicants
}

type Mutation {
  submitApplicant (
    ApplicantId: Int!
    LastName: String!
    FirstName: String!
    BirthDate: Int
    Email: String!
    IsWorking: Int!
    EducationLevelId: Int!
    EducationLevelFinished: Int!
    YearsOfExperience: Int!
    DesiredSalary: Int!
    SalaryTypeId: Int!
    ContractTypeId: Int!
    TechnicalSkillIds: [Int]
  ) : Applicant

  deleteApplicant (ApplicantId: Int!) : Int

}

schema {
  query: Query
  mutation: Mutation
}

`];

const resolvers = {
  EducationLevel: {
    EducationLevelId: property('EducationLevelId'),
    Description: property('Description')
  },

  ContractType: {
    ContractTypeId: property('ContractTypeId'),
    Description: property('Description')
  },

  SalaryType: {
    SalaryTypeId: property('SalaryTypeId'),
    Description: property('Description')
  },

  TechnicalSkill: {
    TechnicalSkillId: property('TechnicalSkillId'),
    Description: property('Description')
  },

  Applicant: {
    ApplicantId: property('ApplicantId'),
    LastName: property('LastName'),
    FirstName: property('FirstName'),
    Email: property('Email'),
    BirthDate: property('BirthDate'),
    Age: ({ BirthDate }) => { 
      if(BirthDate) {
        return Math.abs(new Date(new Date() - BirthDate).getUTCFullYear() - 1970) 
      }
      return null;
    },
    IsWorking: property('IsWorking'),
    EducationLevel({ EducationLevelId  }, _, context) {
      return context.EducationLevel.getById(EducationLevelId);
    },
    EducationLevelFinished: property('EducationLevelFinished'),
    YearsOfExperience: property('YearsOfExperience'),
    DesiredSalary: property('DesiredSalary'),
    SalaryType({ SalaryTypeId }, _, context) {
      return context.SalaryType.getById(SalaryTypeId);
    },
    ContractType({ ContractTypeId }, _, context){
      return context.ContractType.getById(ContractTypeId);
    },
    TechnicalSkills({ ApplicantId }, _, context) {
      return context.ApplicantTechnicalSkill.getByApplicantId(ApplicantId);
    }
  },

  ApplicantTechnicalSkill: {
    ApplicantId: property('ApplicantId'),
    TechnicalSkillId: property('TechnicalSkillId')    
  },

  Query: {
    EducationLevels(root, args, context) {
      return context.EducationLevel.getAll();
    },
    SalaryTypes(root, args, context) {
      return context.SalaryType.getAll();
    },
    ContractTypes(root, args, context) {
      return context.ContractType.getAll();
    },
    TechnicalSkills(root, args, context) {
      return context.TechnicalSkill.getAll();
    },
    Applicant(root, { ApplicantId }, context) {
      return context.Applicant.getById(ApplicantId);
    },
    // Applicants(root, args, context) {
    //   return context.Applicants.getAll();
    // }
    PaginatedApplicants(root, { page, count }, context) {
      return context.Applicants.getByPage(page, count);
    }
  },

  Mutation: {
    submitApplicant(root, { ApplicantId, LastName, FirstName, BirthDate, Email, IsWorking, EducationLevelId, EducationLevelFinished, YearsOfExperience, DesiredSalary, SalaryTypeId, ContractTypeId, TechnicalSkillIds}, context) {
      return Promise.resolve()
        .then(() => (context.Applicant.save(ApplicantId, LastName, FirstName, BirthDate, Email, IsWorking, EducationLevelId, EducationLevelFinished, YearsOfExperience, DesiredSalary, SalaryTypeId, ContractTypeId, TechnicalSkillIds)))
        .then(() => context.Applicant.getById(ApplicantId));
    },
    deleteApplicant(root, { ApplicantId }, context) {
      return Promise.resolve()
        .then(() => context.Applicant.delete(ApplicantId));
    }
  }
};

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers: Object.assign(dateResolver, resolvers)
});

export default executableSchema;