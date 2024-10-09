import { Outlet } from "react-router-dom";

function UnAuthorisedLayout() {
  return (
    <div style={{backgroundColor: 'blue'}} >
      <Outlet />
    </div>
  );
}

export default UnAuthorisedLayout;
