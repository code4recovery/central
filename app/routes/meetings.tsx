import Template from "../components/Template";
import Table from "../components/Table";

export default function Meetings() {
  return (
    <Template
      title="Meetings"
      description="A list of all the meetings in your account."
    >
      <Table />
    </Template>
  );
}
