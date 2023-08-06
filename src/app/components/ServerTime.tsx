async function getServerTime() {
  return Date.now();
}

export default async function ServerTime() {
  const time = await getServerTime();

  console.log("Time:", new Date(time).toLocaleString());

  return <>Current time on server: {new Date(time).toLocaleString()}</>;
}
