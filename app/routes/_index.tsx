import Template from "../components/Template";
import Table from "../components/Table";

export default function Index() {
  return (
    <Template
      title="Users"
      description="A list of all the users in your account including their name, title, email and role."
    >
      <Table />
    </Template>
  );
}
