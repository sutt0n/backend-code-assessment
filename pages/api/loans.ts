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
        `);

    res.status(200).json([camelcaseKeys(result.rows), +result.rows[0]?.total_count || result.rowCount]);
  } catch (err: any) {
    console.log(err);
    res.status(500).send(err.message);
  } finally {
    await client.end();
  }
}
