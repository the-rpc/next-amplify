async function getServerTime() {
  return Date.now();
}

export default async function ServerTime() {
  const time = await getServerTime();

  return <>Current time on server: {new Date(time).toLocaleString()}</>;
}
