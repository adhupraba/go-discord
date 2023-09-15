interface IServerPageProps {
  params: { serverId: string };
}

const ServerPage = ({ params: { serverId } }: IServerPageProps) => {
  return <div>ServerPage - {serverId}</div>;
};

export default ServerPage;
