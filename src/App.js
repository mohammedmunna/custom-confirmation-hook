import "./styles.css";
import useConfirmation from "./Confirmation";

const DeleteWithUseConfirm = () => {
  const [getConfirmation, ConfirmationDialog] = useConfirmation();

  const onDelete = async () => {
    const status = await getConfirmation({
      offer: { name: "MyOffer" },
      entity: "product-category",
      item: { name: "MyCategory" },
      buttons: [
        { label: "create", value: "create" },
        { label: "map", value: "map" },
        { label: "skip", value: "skip" }
      ]
    });

    console.log({ status });

    if (status === "map") {
      console.log({ status });
    } else {
      console.log({ status });
    }
  };

  return (
    <>
      <button onClick={onDelete}>Click Me</button>
      <ConfirmationDialog />
    </>
  );
};

export default function App() {
  return (
    <div className="App">
      <h1>Custom Confirmation</h1>
      <h2>Async/Await Custom Confirmation React Hoook</h2>
      <DeleteWithUseConfirm />
    </div>
  );
}
