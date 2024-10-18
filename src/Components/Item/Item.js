import { Stack } from "@mui/material";

function Item(props) {
  const { item } = props;
  return (
    <div className={"task"}>
      {" "}
      <Stack>
        <div>
          <sup>{item.shortId}</sup>
        </div>
        <div>{item.name}</div>
      </Stack>
    </div>
  );
}
export default Item;
