import { AddRounded } from "@mui/icons-material";
import { Box, Button, Divider, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useParams } from "react-router-dom";
import AddStageDialog from "../AddStage/AddStage";
import "./ViewList.css";
import CreateItemDialog from "../CreateItem/CreateItem";
export default function ViewList() {
  const [openItemAdd, setItemAddOpen] = useState(false);
  const [openStageAdd, setStageAddOpen] = useState(false);
  const [list, setList] = useState({});
  const [stages, setStages] = useState([]);
  const { listId } = useParams();
  const [activeStageId, setActiveStageId] = useState();
  const [activeStageName, setActiveStageName] = useState();

  const handleItemAddOpen = () => {
    setItemAddOpen(true);
  };

  const handleItemAddClose = (value) => {
    setItemAddOpen(false);
  };
  const handleStageAddOpen = () => {
    setStageAddOpen(true);
  };

  const handleStageAddClose = (value) => {
    setStageAddOpen(false);
    getLists();
  };
  useEffect(() => {
    getLists();
  }, [listId]);

  function addItem(stageId, stageName) {
    setActiveStageId(stageId);
    setActiveStageName(stageName);
    handleItemAddOpen();
  }

  async function getLists() {
    let token = localStorage.getItem("token");
    let headers = new Headers();
    headers.append("content-type", "application/json");
    headers.append("Authorization", "Bearer " + token);
    await fetch(`http://localhost:5134/api/lists/${listId}/stage`, {
      method: "GET",
      headers,
    }).then(async (res) => {
      if (res.ok) {
        let response = await res.json();
        setList({ ...response });
        if (response.stages && response.stages.length > 0) {
          const newStages = response.stages.map(async (stage) => {
            stage.tasks = await getTasks(stage.id);
          });
          setStages([...newStages]);
        }
      }
    });
  }

  function getTasks(stageId) {
    return new Promise(async (resolve, rej) => {
      let token = localStorage.getItem("token");
      let headers = new Headers();
      headers.append("content-type", "application/json");
      headers.append("Authorization", "Bearer " + token);
      await fetch(`http://localhost:5134/api/stages/${stageId}/tasks`, {
        method: "GET",
        headers,
      }).then(async (res) => {
        if (res.ok) {
          let response = await res.json();
          if (response) {
            resolve(response);
          }
        } else {
          rej([]);
        }
      });
    });
  }

  return (
    <>
      <header
        style={{ display: "flex", justifyContent: "space-between" }}
        className=""
      >
        <div>{list.name}</div>
        <Button
          style={{ marginLeft: "auto" }}
          variant="contained"
          onClick={handleItemAddOpen}
        >
          Add Item
        </Button>
        <Button
          style={{ marginLeft: "5px" }}
          variant="contained"
          onClick={handleStageAddOpen}
        >
          Add Stage
        </Button>
        {openStageAdd ? (
          <AddStageDialog
            open={true}
            activeListId={list.id}
            listCount={stages.length}
            onClose={handleStageAddClose}
          />
        ) : (
          ""
        )}
        {openItemAdd ? (
          <CreateItemDialog
            open={openItemAdd}
            activeStageId={activeStageId}
            activeStageName={activeStageName}
            activeListId={list.id}
            onClose={handleItemAddClose}
          />
        ) : (
          ""
        )}
      </header>
      <div className="lists-container">
        <DragDropContext>
          {stages.map((stage, i) => {
            return (
              <Box
                key={i}
                sx={{
                  height: "100%",
                  width: "180px",
                  border: " 1px solid #bf9c98",
                  borderRadius: "10px",
                }}
              >
                <div className="list-title">
                  {stage.name}{" "}
                  <IconButton
                    onClick={() => {
                      addItem(stage.id, stage.name);
                    }}
                  >
                    {" "}
                    <AddRounded
                      sx={{
                        borderRadius: "20px",
                        backgroundColor: "rgb(213, 200, 200)",
                      }}
                    />
                  </IconButton>
                </div>
                <Divider variant="fullWidth" />
                <Droppable key={i} index={i} droppableId={stage.id} >
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {(stage.tasks ? stage.tasks : []).map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div>
                              <div
                                ref={provided.innerRef}
                                {...provided.dragHandleProps}
                                {...provided.droppableProps}
                                {...provided.draggableProps}
                                // style={getItemStyle(
                                //   provided.draggableProps.style,
                                //   snapshot.isDragging
                                // )}
                              >
                                {item.name}
                              </div>
                              {provided.placeholder}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Box>
            );
          })}
        </DragDropContext>
      </div>
    </>
  );
}
