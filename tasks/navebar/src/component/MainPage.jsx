import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { Autocomplete, TextField } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import Slide from '@mui/material/Slide';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import './mainDesign.css'
import Alert from '@mui/joy/Alert';
import AspectRatio from '@mui/joy/AspectRatio';
import CircularProgress from '@mui/joy/CircularProgress';
import LinearProgress from '@mui/joy/LinearProgress';
import Stack from '@mui/joy/Stack';
import Check from '@mui/icons-material/Check';
import Close from '@mui/icons-material/Close';
import CloseIcon from '@mui/icons-material/Close';
import Avatar from '@mui/material/Avatar';
import Warning from '@mui/icons-material/Warning';
import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles

// ..
AOS.init();



const drawerWidth = 240;

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const listOfTask = [
  { taskname: 'DESIGNER HEAD', completed: false, locked: false, description: 'Task-1-description', assignedUsers: [] },
  { taskname: 'SIGHT MEASUREMENT', completed: false, locked: true, description: 'Task-2-description', assignedUsers: [] },
  { taskname: 'DESIGNER-Task-1', completed: false, locked: true, description: 'Task-3-description', assignedUsers: [] },
  { taskname: 'DESIGNER-Task-2', completed: false, locked: true, description: 'Task-4-description', assignedUsers: [] },
  { taskname: 'DESIGNER-Task-3', completed: false, locked: true, description: 'Task-5-description', assignedUsers: [] },
  { taskname: 'Production Drawing', completed: false, locked: true, description: 'Task-5-description', assignedUsers: [] },
];


const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [dilogOpen, setDilogOpen] = React.useState(false);
  const [storeTask, setStoreTask] = React.useState(() => {
    // Load tasks from local storage when the component mounts
    const savedTasks = localStorage.getItem('tasks');
    console.log("savedTasks", savedTasks);

    return savedTasks ? JSON.parse(savedTasks) : listOfTask;
  });
  console.log("storeTask", storeTask);


  const [typingTaskName, setTypingTaskName] = React.useState('');
  const [typingDiscription, setTypingDiscription] = React.useState('');
  console.log("typingDiscription", typingDiscription);

  const [selectedTaskIndex, setSelectedTaskIndex] = React.useState(null);

  const [isUpdateMode, setIsUpdateMode] = React.useState(false);
  const [visibleTasks, setVisibleTasks] = React.useState({});
  const [hiddenTasks, setHiddenTasks] = React.useState([]);
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [completedTaskName, setCompletedTaskName] = React.useState('');

  console.log("completedTaskName", completedTaskName);
  // Save tasks to local storage whenever the task list changes
  React.useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(storeTask));
  }, [storeTask]);

  React.useEffect(() => {
    AOS.init();
  }, []);

  const createNewTask = () => {
    const newTask = {
      taskname: typingTaskName,
      completed: false,
      locked: true,
      discription: typingDiscription,
    };

    const updatedTasks = [...storeTask]; // Create a copy of the task array
    let newTaskIndex;

    if (selectedTaskIndex !== null) {
      updatedTasks.splice(selectedTaskIndex + 1, 0, newTask); // Insert the new task after the selected task
      newTaskIndex = selectedTaskIndex + 1;
    } else {
      updatedTasks.push(newTask); // Add new task to the end if no task is selected
      newTaskIndex = updatedTasks.length - 1;
    }

    setStoreTask(updatedTasks); // Update the task list in the state


    // Reset dialog state
    setTypingTaskName('');
    setTypingDiscription('');
    setDilogOpen(false);

    // Call useEffect to manage hidden tasks
    setHiddenTasks((prev) => [...prev, newTaskIndex]);
  };

  React.useEffect(() => {
    if (hiddenTasks.length > 0) {
      const updatedVisibleTasks = { ...visibleTasks };

      // Hide tasks based on hiddenTasks state
      hiddenTasks.forEach((index) => {
        updatedVisibleTasks[index] = false; // Set the visibility of the new task to false
      });

      setVisibleTasks(updatedVisibleTasks);
    }
  }, [hiddenTasks]);



  const handleUpdateTask = () => {
    const timestamp = new Date().toLocaleString(); // Get readable date and time
    const updatedTasks = storeTask.map((task, index) =>
      index === selectedTaskIndex
        ? {
          ...task,
          taskname: typingTaskName,
          discription: [
            ...(task.discription || []), // Keep existing descriptions
            { timestamp, text: typingDiscription } // Add new description with formatted timestamp
          ]
        }
        : task
    );

    setStoreTask(updatedTasks);
    setDilogOpen(false);
    setIsUpdateMode(false); // Exit update mode
    setTypingTaskName('');
    setTypingDiscription('');
  };



  const handleCompleteTask = (index) => {
    setSelectedTaskIndex(index);
    const updatedTasks = storeTask.map((task, idx) => {
      if (idx === index) {
        // Mark the current task as completed and locked
        return { ...task, completed: true, locked: true };
      }
      if (idx === index + 1) {
        // Unlock the next task after the current task is completed
        return { ...task, locked: false };
      }
      return task;
    });


    setStoreTask(updatedTasks);
    setCompletedTaskName(updatedTasks[index].taskname);
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
    }, 2000); // 2 seconds delay
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };




  const handleClose = () => {
    setDilogOpen(false);
  };

  const handleDialogOpen = (index, updateMode = false) => {
    setSelectedTaskIndex(index);
    setIsUpdateMode(updateMode); // Set update mode based on action
    if (updateMode) {
      const taskToUpdate = storeTask[index];
      setTypingTaskName(taskToUpdate.taskname);
      setTypingDiscription(taskToUpdate.discription);
    }
    setDilogOpen(true);
  };

  const toggleTasksVisibility = (index) => {
    setVisibleTasks((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };




  const [selectedSightMeasurement, setSelectedSightMeasurement] = React.useState(null);
  const [selectedDesigner, setSelectedDesigner] = React.useState(null);
  const [selectedProductionDrawing, setSelectedProductionDrawing] = React.useState(null);
  const [openAuthoriziation, setOpenAuthoriziation] = React.useState(false);
  const [selectedName, setSelectedName] = React.useState([]);
  console.log("selectedName", selectedName);




  const sightMesurement = [
    { label: 'Gabrielle Villalobos' },
    { label: 'Leo Hardin' },
    { label: 'Vada Weber' },
  ];

  const designers = [
    { label: 'Bear Horne' },
    { label: 'The Godfather' },
    { label: 'Crew Sweeney' },
  ];

  const productionDrawing = [
    { label: 'Brixton Nash' },
    { label: 'Nikolas Dyer' },
    { label: 'Pulp Fiction' },
  ];


  const createAuthorizations = () => {
    const authorizations = {
      sightMeasurement: selectedSightMeasurement.label,
      designer: selectedDesigner.label,
      productionDrawing: selectedProductionDrawing.label,
    };

    // Update the first unlocked task with the assigned users
    const updatedTasks = storeTask.map((task) => {
      if (task.taskname === 'SIGHT MEASUREMENT') {
        return {
          ...task,
          assignedUsers: [authorizations.sightMeasurement], // Assign sight measurement user
        };
      } else if (task.taskname === 'DESIGNER-Task-1' && 'DESIGNER-Task-2' && 'DESIGNER-Task-3') {
        return {
          ...task,
          assignedUsers: [authorizations.designer], // Assign designer user
        };
      } else if (task.taskname === 'Production Drawing') {
        return {
          ...task,
          assignedUsers: [authorizations.productionDrawing], // Assign production drawing user
        };
      }

      // If no matching task, return the task as-is
      return task;
    });

    setStoreTask(updatedTasks);

    // Update the task list and close the modal
    setStoreTask(updatedTasks);
    setOpenAuthoriziation(false);
  };

  const HandleCloseAuthorization = () => {
    setOpenAuthoriziation(false);
  };

  const HandleOpenAuthorization = () => {
    setOpenAuthoriziation(true);
  }






  return (
    <Box sx={{ display: 'flex', backgroundColor: '', height: '100%' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar
          sx={{
            background: '#FF964L', // Futuristic gradient background
            padding: '10px 20px', // Adjust padding
            transition: 'all 0.3s ease-in-out', // Smooth transition

          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              mr: 2,
              ...(open && { display: 'none' }),
              transition: 'transform 0.3s ease', // Smooth transition for icon
              '&:hover': {
                transform: 'scale(1.1)', // Slightly scale up on hover
              },
            }}
          >
            {/* <MenuIcon /> */}
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{
            color: 'white', // Change text color for better contrast
            fontWeight: 'bold', // Bold font weight
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)', // Text shadow for depth
          }}>
            TASKS LIST
          </Typography>
        </Toolbar>

      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Divider />
        {/* Add any additional drawer content here */}

      </Drawer>

      <Main open={open}>
        <Box sx={{
          marginBottom: '10px',
          marginTop: '20vh',
        }}

        >
          {storeTask.map((task, index) => {
            const isTaskVisible = visibleTasks[index]; // Check if the task is visible
            const isTaskCompleted = task.completed;
            const isTaskLocked = task.locked;

            return (
              <Box key={index}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  alignItems: 'center',
                  fontFamily: 'Roboto, sans-serif', // Change to your desired font family
                  gap: 6,
                  marginTop: '1vh',
                  cursor: 'pointer',
                  transition: theme.transitions.create('background-color'),

                }} >
                {/* Task Card */}
                <div data-aos="fade-up" data-aos-duration="1000" >
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Card
                      sx={{
                        width: '100vh',
                        display: 'flex',
                        backgroundColor: isTaskCompleted
                          ? '#FF964A'
                          : isTaskLocked
                            ? '#AFB1B3'
                            : '#AE5138',
                        justifyContent: 'center',
                        fontFamily: 'Roboto, sans-serif', // Font family applied to the Card as well
                        position: 'relative',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.25)', // Initial shadow
                        transition: 'all 0.3s ease', // Smooth transition
                        '&:hover': {
                          boxShadow: '0 6px 15px rgba(0, 0, 0, 0.35)', // Shadow on hover
                          transform: 'translateY(-2px)', // Lift effect on hover
                        },
                        '&:active': {
                          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.25)', // Shadow when pressed
                          transform: 'translateY(1px)', // Press down effect
                        }
                      }}
                    >
                      <CardActionArea>
                        <CardContent>

                          <Typography gutterBottom variant="h5" component="div" sx={{ fontFamily: 'Roboto, sans-serif', fontSize: '16px' }} >
                            {task.taskname}
                          </Typography>
                          {/* Show description if the task is visible */}




                        </CardContent>
                      </CardActionArea>


                      {/* Display Avatars for assigned users */}
                      {task.assignedUsers && task.assignedUsers.length > 0 ? (
                        <Stack style={{
                          cursor: isTaskLocked ? "not-allowed" : "pointer",
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '40px',
                          color: 'black',
                          marginTop: '0.1vh',
                          marginRight: '10vh',
                        }} direction="row" spacing={1}>
                          {task.assignedUsers.map((user, userIndex) => (
                            <Avatar key={userIndex} alt={user} src={`/static/images/avatar/${userIndex + 1}.jpg`} />
                          ))}
                        </Stack>
                      ) : (
                        index > 0 && (
                          <AccountCircleIcon
                            style={{
                              cursor: isTaskLocked ? "not-allowed" : "pointer",
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '40px',
                              color: 'white',
                              marginTop: '1.5vh',
                              marginRight: '10vh',
                            }}
                          />
                        )
                      )}


                      <IconButton aria-label="more" onClick={() => toggleTasksVisibility(index)}>
                        <ArrowDropDownIcon />
                      </IconButton>
                    </Card>

                    {!isTaskCompleted && !isTaskLocked && (
                      <div style={{
                        display: "flex",
                        gap: '1vh',
                      }}  >
                        {/* <Button variant="outlined" color="success" onClick={() => handleDialogOpen(index, true)}>
              Update
              </Button> */}
                        {
                          index < 1 ? (<Button sx={{
                            position: 'relative',
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.25)', // Initial shadow
                            transition: 'all 0.3s ease', // Smooth transition
                            '&:hover': {
                              boxShadow: '0 6px 15px rgba(0, 0, 0, 0.35)', // Shadow on hover
                              transform: 'translateY(-2px)', // Lift effect on hover
                            },
                            '&:active': {
                              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.25)', // Shadow when pressed
                              transform: 'translateY(1px)', // Press down effect
                            }
                          }} variant="outlined" color="success" onClick={HandleOpenAuthorization}>
                            Assign
                          </Button>) : (<Button variant="outlined" color="success" sx={{
                            position: 'relative',
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.25)', // Initial shadow
                            transition: 'all 0.3s ease', // Smooth transition
                            '&:hover': {
                              boxShadow: '0 6px 15px rgba(0, 0, 0, 0.35)', // Shadow on hover
                              transform: 'translateY(-2px)', // Lift effect on hover
                            },
                            '&:active': {
                              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.25)', // Shadow when pressed
                              transform: 'translateY(1px)', // Press down effect
                            }
                          }} onClick={() => handleDialogOpen(index, true)}>
                            Update
                          </Button>)
                        }
                        <Button sx={{
                          position: 'relative',
                          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.25)', // Initial shadow
                          transition: 'all 0.3s ease', // Smooth transition
                          '&:hover': {
                            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.35)', // Shadow on hover
                            transform: 'translateY(-2px)', // Lift effect on hover
                          },
                          '&:active': {
                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.25)', // Shadow when pressed
                            transform: 'translateY(1px)', // Press down effect
                          }
                        }} variant="outlined" color="success" onClick={() => handleCompleteTask(index)}>
                          Complete
                        </Button>
                      </div>
                    )}
                  </Box>
                  {isTaskVisible && <Box sx={{
                    marginTop: 2,
                    width: '100vh',
                    height: 'auto',
                    backgroundColor: "#FFFCE1",
                    borderRadius: '10px',
                    padding: '5px 15px 5px 15px ',
                    fontFamily: 'Roboto, sans-serif', // Font family applied to the Card as well
                    position: 'relative',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.25)', // Initial shadow
                    transition: 'all 0.3s ease', // Smooth transition
                    '&:hover': {
                      boxShadow: '0 6px 15px rgba(0, 0, 0, 0.35)', // Shadow on hover
                      transform: 'translateY(-2px)', // Lift effect on hover
                    },
                    '&:active': {
                      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.25)', // Shadow when pressed
                      transform: 'translateY(1px)', // Press down effect
                    }
                  }} >

                    {task.discription && task.discription.map((entry, entryIndex) => (
                      <Box key={entryIndex} sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="caption" sx={{ color: 'gray', fontSize: '12px' }}>
                          {entry.timestamp}
                        </Typography>
                        <Typography variant="body1" sx={{ fontSize: '14px', marginTop: '4px' }}>
                          {entry.text}
                        </Typography>
                      </Box>
                    ))}


                  </Box>}
                </div>
                <div data-aos="fade-up" data-aos-duration="1000"
                >

                  {!isTaskCompleted && !isTaskLocked && (
                    <Button sx={{
                      position: 'relative',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.25)', // Initial shadow
                      transition: 'all 0.3s ease', // Smooth transition
                      '&:hover': {
                        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.35)', // Shadow on hover
                        transform: 'translateY(-2px)', // Lift effect on hover
                      },
                      '&:active': {
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.25)', // Shadow when pressed
                        transform: 'translateY(1px)', // Press down effect
                      }
                    }} variant="outlined" color="error" onClick={() => handleDialogOpen(index)}>
                      <AddIcon />

                    </Button>
                  )}
                </div>




                {/* Success Alert Message */}
                {alertVisible && (
                  <Box>
                    <Stack
                      spacing={2}
                      sx={{
                        maxWidth: 400,
                        position: "fixed",
                        top: 60,
                        right: 0,
                        margin: '10px',
                        zIndex: 1000, // Ensure it appears above other elements
                        pointerEvents: 'none', // Prevent interference with other content
                      }}
                      data-aos="fade-left" // AOS slide effect
                      data-aos-anchor="#example-anchor"
                      data-aos-offset="500"
                      data-aos-duration="5000"
                    >
                      <Alert
                        size="lg"
                        color="success"
                        variant="solid"
                        invertedColors
                        startDecorator={
                          <AspectRatio
                            variant="solid"
                            ratio="1"
                            sx={{
                              minWidth: 40,
                              borderRadius: '50%',
                              boxShadow: '0 2px 12px 0 rgb(0 0 0/0.2)',
                            }}
                          >
                            <div>
                              <Check fontSize="xl2" />
                            </div>
                          </AspectRatio>
                        }
                        endDecorator={
                          <IconButton
                            variant="plain"
                            sx={{
                              '--IconButton-size': '32px',
                              transform: 'translate(0.5rem, -0.5rem)',
                            }}
                          >
                            <Close />
                          </IconButton>
                        }
                        sx={{ alignItems: 'flex-start', overflow: 'hidden' }}
                      >
                        <div>
                          <Typography level="title-lg">{completedTaskName}</Typography>
                          <Typography level="body-sm">
                            has been completed successfully.
                          </Typography>
                        </div>
                        <LinearProgress
                          variant="solid"
                          color="success"
                          value={40}
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            borderRadius: 0,
                          }}
                        />
                      </Alert>
                    </Stack>
                  </Box>
                )}



                {/* DESIGNER ASSIGNING FORM */}

                <Box>


                  <React.Fragment>
                    <BootstrapDialog
                      onClose={HandleCloseAuthorization}
                      aria-labelledby="customized-dialog-title"
                      open={openAuthoriziation} // Set open as per your condition
                    >
                      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                        Access Control
                      </DialogTitle>
                      <IconButton
                        aria-label="close"
                        onClick={HandleCloseAuthorization}
                        sx={(theme) => ({
                          position: 'absolute',
                          right: 8,
                          top: 8,
                          color: theme.palette.grey[500],
                        })}
                      >
                        <CloseIcon />
                      </IconButton>
                      <DialogContent dividers>
                        <Box>
                          <Box
                            sx={{
                              width: '60vh',
                              gap: 6,
                            }}
                          >
                            <div data-aos="fade-up" data-aos-duration="1000" >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  margin: '10px 10px 25px 10px',
                                }}
                              >
                                <p>SIGHT MEASUREMENT</p>
                                <div>
                                  <Autocomplete
                                    disablePortal
                                    options={sightMesurement}
                                    sx={{ width: '30vh' }}
                                    renderInput={(params) => <TextField {...params} />}
                                    onChange={(event, newValue) => setSelectedSightMeasurement(newValue)}
                                  />
                                </div>
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  margin: '10px 10px 25px 10px',
                                }}
                              >
                                <p>DESIGNERS</p>
                                <div>
                                  <Autocomplete
                                    disablePortal
                                    options={designers}
                                    sx={{ width: '30vh' }}
                                    renderInput={(params) => <TextField {...params} />}
                                    onChange={(event, newValue) => setSelectedDesigner(newValue)}
                                  />
                                </div>
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  margin: '10px 10px 25px 10px',
                                }}
                              >
                                <p>PRODUCTION DRAWING</p>
                                <div>
                                  <Autocomplete
                                    disablePortal
                                    options={productionDrawing}
                                    sx={{ width: '30vh' }}
                                    renderInput={(params) => <TextField {...params} />}
                                    onChange={(event, newValue) => setSelectedProductionDrawing(newValue)}
                                  />
                                </div>
                              </div>
                            </div>
                          </Box>
                        </Box>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={HandleCloseAuthorization}>Cancel</Button>
                        <Button onClick={createAuthorizations}>Save changes</Button>
                      </DialogActions>
                    </BootstrapDialog>
                  </React.Fragment>
                </Box>



              </Box>
            );
          })}

        </Box>


      </Main>

      <Dialog open={dilogOpen} onClose={handleClose}>
        <DialogTitle>{isUpdateMode ? 'Update Task' : 'Create New Task'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="taskname"
            label="Task Name"
            type="text"
            fullWidth
            variant="standard"
            value={typingTaskName}
            onChange={(e) => setTypingTaskName(e.target.value)}
          />
          <TextField
            margin="dense"
            id="discription"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            value={typingDiscription}
            onChange={(e) => setTypingDiscription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={isUpdateMode ? handleUpdateTask : createNewTask}>
            {isUpdateMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
