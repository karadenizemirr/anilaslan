import { User } from "src/user/dto/user.dto";
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
    entities: [User,Work],
    subscribers: [],
    migrations: [],
})