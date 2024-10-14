import { AddRounded } from "@mui/icons-material";
import { Box, Button, Divider, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
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
    await fetch(`/api/lists/${listId}/stage`, {
      method: "GET",
      headers,
    }).then(async (res) => {
      if (res.ok) {
        let response = await res.json();
        setList({ ...response });
        setStages([]);
        let newStages = [];
        if (response.stages && response.stages.length > 0) {
          for (let i = 0; i < response.stages.length; i++) {
            var currentStage = response.stages[i];
            newStages.push({
              ...currentStage,
              tasks: await getTasks(currentStage.id),
            });
          }
        }
        setStages([...newStages]);
      }
    });
  }
  async function getTasks(stageId) {
    return await new Promise(async (resolve, rej) => {
      let token = localStorage.getItem("token");
      let headers = new Headers();
      headers.append("content-type", "application/json");
      headers.append("Authorization", "Bearer " + token);
      await fetch(`/api/stages/${stageId}/tasks`, {
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
  function dragEnd(props) {
    console.log(props);
    var destinationStage = props?.destination;
    var sourceStage = props?.source;
    var movedItem = undefined;

    var FinalStage = [];
    for (let i = 0; i < stages.length; i++) {
      let aStage = stages[i];
      if (aStage.id === sourceStage.droppableId) {
        movedItem = aStage.tasks[sourceStage.index];
        aStage.tasks.splice(sourceStage.index, 1);
      }
    }
    for (let i = 0; i < stages.length; i++) {
      let aStage = stages[i];
      if (aStage.id === destinationStage.droppableId) {
        aStage.tasks.splice(destinationStage.index, 0, movedItem);
      }
    }
    console.log(stages);
    // toDoItemId,stageId,Order
    let FinalOrder = [];
    stages.forEach((aStage) => {
      ((aStage.tasks && aStage.tasks.length > 0) ? aStage.tasks : []).forEach(
        (aTask, ind) => {
          FinalOrder.push({
            toDoItemId: aTask.id,
            stageId: aStage.id,
            order: ind,
          });
        }
      );
    });

    updateStage(FinalOrder);
  }
  async function updateStage(payload) {
    let token = localStorage.getItem("token");
    let headers = new Headers();
    headers.append("content-type", "application/json");
    headers.append("Authorization", "Bearer " + token);
    try {
      await fetch(`/api/ToDo/updateStage`, {
        method: "PUT",
        body: JSON.stringify(payload),
        headers,
      });
    } catch (ex) {
      console.log(ex);
    }
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
        <DragDropContext onDragEnd={dragEnd}>
          {stages.map((stage, i) => {
            return (
              <Box
                key={i}
                sx={{
                  height: "100%",
                  width: "180px",
                  border: " 1px solid #bf9c98",
                  borderRadius: "10px",
                  order: stage.order,
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
                <Droppable key={i} index={i} droppableId={stage.id}>
                  {(provided, snapshot) => (
                    <div
                      key={stage.id}
                      draggableId={stage.id}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {(stage.tasks ? stage.tasks : []).map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id + ""}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.dragHandleProps}
                              {...provided.draggableProps}
                            >
                              <div

                              // style={getItemStyle(
                              //   provided.draggableProps.style,
                              //   snapshot.isDragging
                              // )}
                              >
                                {item.name}
                              </div>
                              {provided.placeholder}
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
