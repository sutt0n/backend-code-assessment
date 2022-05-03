import type { NextApiRequest, NextApiResponse } from "next";

import camelcaseKeys from "camelcase-keys";

import { getClient } from "src/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = getClient();
  try {
    await client.connect();

    const page = +req.query.page;
    const pageSize = +req.query.pageSize;
    const searchTerm = req.query.searchTerm;

    let whereClause = '';

    if(searchTerm) {
      whereClause = `
      where
        t3.name ilike '${searchTerm}%'
        OR
        t2.city ilike '${searchTerm}%'
      `
    }

    const result = await client.query(`
    select
      loan_id as id,
      amount, 
      funding_date, 
      loan_term, 
      loan_rate, 
      address_1, 
      city, 
      state, 
      zip_code,
      company_name,
      total_count,
      sum(amount) over() as total_loan
    from (
      select
        t1.id AS loan_id,
        t1.*,
        t2.address_1,
        t2.city,
        t2.state,
        t2.zip_code,
        t3.name as company_name,
        count(*) over() as total_count
      from loan t1
      left join address t2
          on t1.address_id = t2.id
      left join company t3
          on t1.company_id = t3.id
      ${whereClause}
      limit ${pageSize} offset ${page * pageSize}
    ) q
    `);

    // not a rollup, used a subquery; rollup with offset resulted in 
    // a total aggregated sum of all loan amounts
    const totalCount = +result.rows[0]?.total_count || result.rowCount;
    const totalLoanAmount = +result.rows[0]?.total_loan || null;

    res.status(200).json([camelcaseKeys(result.rows), totalCount, totalLoanAmount]);
  } catch (err: any) {
    console.log(err);
    res.status(500).send(err.message);
  } finally {
    await client.end();
  }
}
