import promisePool from "../database"
import { RowDataPacket, ResultSetHeader } from "mysql2"

export default {
   async getagentbyagentToken(token: string) {
      const res = await promisePool.query<RowDataPacket[]>(`SELECT * FROM agents WHERE agentToken= ?`, [token])
      return res[0]
   },
   async getagentbysecretkey(secretkey: string) {
      const res = await promisePool.query<RowDataPacket[]>(`SELECT * FROM agents WHERE secretKey= ?`, [secretkey])
      return res[0]
   },
   async getuserbyagent(usercode: number, agentid: number) {
      const res = await promisePool.query<RowDataPacket[]>(`SELECT * FROM users WHERE username= ? and agentid = ?`, [usercode, agentid])
      return res[0]
   },
   async setbalanceuserbyid(id: number, balance: number) {
      const res = await promisePool.query<ResultSetHeader[]>("UPDATE users SET saldo = ? WHERE id=?", [balance, id])
      return res[0]
   },
   async createuser(user_code: string, tokenuser: string, atkuser: string, balance: number, agentid: number) {
      const res = await promisePool.query<ResultSetHeader>("INSERT INTO users (username,token,atk,saldo,agentid) VALUES(?,?,?,?,?)", [user_code, tokenuser, atkuser, balance, agentid])
      return res[0]
   },
   async attagent(id: number, probganho: string, probbonus: string, probganhortp: string, probganhoinfluencer: string, probbonusinfluencer: string, probganhoaposta: string, probganhosaldo: string) {
      const res = await promisePool.query<ResultSetHeader>("UPDATE agents SET probganho = ?,probbonus = ?,probganhortp = ?,probganhoinfluencer = ?,probbonusinfluencer = ?,probganhoaposta = ?,probganhosaldo = ? WHERE id=?", [probganho, probbonus, probganhortp, probganhoinfluencer, probbonusinfluencer, probganhoaposta, probganhosaldo, id])
      return res[0]
   },
   async createagent(
      agentCode: string,
      agentToken: string,
      secretKey: string,
      saldo: number,
      probganho: string,
      probbonus: string,
      probganhortp: string,
      probganhoinfluencer: string,
      probbonusinfluencer: string,
      probganhoaposta: string,
      probganhosaldo: string,
      callbackurl: string
   ) {
      // agents.id in the schema may not be AUTO_INCREMENT; insert using MAX(id)+1 to be safe
      const sql = `INSERT INTO agents (
         id, agentCode, saldo, agentToken, secretKey, 
         probganho, probbonus, probganhortp, probganhoinfluencer, 
         probbonusinfluencer, probganhoaposta, probganhosaldo, callbackurl
      ) SELECT IFNULL(MAX(id),0)+1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? FROM agents`;

      const res = await promisePool.query<ResultSetHeader>(sql, [
         agentCode, saldo, agentToken, secretKey,
         probganho, probbonus, probganhortp, probganhoinfluencer,
         probbonusinfluencer, probganhoaposta, probganhosaldo, callbackurl
      ]);
      return res[0];
   },
   async getAllAgents() {
      const res = await promisePool.query<RowDataPacket[]>("SELECT * FROM agents");
      return res[0];
   },
   async getAllUsers() {
      const res = await promisePool.query<RowDataPacket[]>("SELECT * FROM users");
      return res[0];
   },
}
