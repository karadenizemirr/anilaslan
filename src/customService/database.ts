import { User } from "src/user/dto/user.dto";
import { Apporoved } from "src/work/dto/apporoved.dto";
import { Work } from "src/work/dto/work.dto";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "administrator",
    password: "123456",
    database: "anılaslan",
    synchronize: true,
    logging: true,
    entities: [User,Work,Apporoved],
    subscribers: [],
    migrations: [],
})

// export const AppDataSource = new DataSource({
//     type: "mysql",
//     host: "yvu4xahse0smimsc.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
//     port: 3306,
//     username: "zsa51cmh5gsa7bqa",
//     password: "ruycnjbtjk4isu8p",
//     database: "yqrjt17cvrm41htt",
//     synchronize: true,
//     logging: true,
//     entities: [User,Work,Apporoved],
//     subscribers: [],
//     migrations: [],
// })