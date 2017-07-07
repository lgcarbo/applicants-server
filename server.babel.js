import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';
import schema from './api/schema';
import { EducationLevel, SalaryType, ContractType, TechnicalSkill, Applicant, ApplicantTechnicalSkill, Applicants } from './api/models';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/graphql', graphqlExpress((req) => {
    return {
        schema,
        context: {
            EducationLevel: new EducationLevel(),
            SalaryType: new SalaryType(),
            ContractType: new ContractType(),
            TechnicalSkill: new TechnicalSkill(),
            Applicant: new Applicant(),
            ApplicantTechnicalSkill: new ApplicantTechnicalSkill(),
            Applicants: new Applicants()
        }
    }
}));

app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql'
}));

app.listen(process.env.PORT || 3001);