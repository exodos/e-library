import useSWR from "swr";
import { baseUrl } from "../../client/config";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const getUser = () => {
  const { data: user } = useSWR(baseUrl + `/user/get-user`, fetcher);

  if (!user) {
    return "I am loading ...";
  }

  //   console.log({ user });

  return <div>{user.oracleId}</div>;
};

export default getUser;
