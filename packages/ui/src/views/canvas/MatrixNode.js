import PropTypes from 'prop-types'
import { useContext, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

// material-ui
import { useTheme } from '@mui/material/styles'
import { IconButton, Box, Typography, Divider, Button } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'

// project imports
import NodeCardWrapper from '../../ui-component/cards/NodeCardWrapper'
import NodeTooltip from '../../ui-component/tooltip/NodeTooltip'
import NodeInputHandler from './NodeInputHandler'
import NodeOutputHandler from './NodeOutputHandler'
import AdditionalParamsDialog from 'ui-component/dialog/AdditionalParamsDialog'
import NodeInfoDialog from 'ui-component/dialog/NodeInfoDialog'

// const
import { baseURL } from 'store/constant'
import { IconTrash, IconCopy, IconInfoCircle, IconAlertTriangle } from '@tabler/icons'
import { flowContext } from 'store/context/ReactFlowContext'

// ===========================|| CANVAS NODE ||=========================== //
function D3Matrix() {
    // set the dimensions and margins of the graph
    const margin = { top: 30, right: 30, bottom: 30, left: 30 },
        width = 450 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom

    // append the svg object to the body of the page
    const svg = d3
        .select('#my_dataviz')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

    // Labels of row and columns
    const myGroups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
    const myVars = ['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8', 'v9', 'v10']

    // Build X scales and axis:
    const x = d3.scaleBand().range([0, width]).domain(myGroups).padding(0.01)
    svg.append('g').attr('transform', `translate(0, ${height})`).call(d3.axisBottom(x))

    // Build X scales and axis:
    const y = d3.scaleBand().range([height, 0]).domain(myVars).padding(0.01)
    svg.append('g').call(d3.axisLeft(y))

    // Build color scale
    const myColor = d3.scaleLinear().range(['white', '#69b3a2']).domain([1, 100])

    //Read the data
    d3.csv('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv').then(function (data) {
        svg.selectAll()
            .data(data, function (d) {
                return d.group + ':' + d.variable
            })
            .join('rect')
            .attr('x', function (d) {
                return x(d.group)
            })
            .attr('y', function (d) {
                return y(d.variable)
            })
            .attr('width', x.bandwidth())
            .attr('height', y.bandwidth())
            .style('fill', function (d) {
                return myColor(d.value)
            })
    })
}
const CanvasNode = ({ data }) => {
    const theme = useTheme()
    const canvas = useSelector((state) => state.canvas)
    const { deleteNode, duplicateNode } = useContext(flowContext)

    const [showDialog, setShowDialog] = useState(false)
    const [dialogProps, setDialogProps] = useState({})
    const [showInfoDialog, setShowInfoDialog] = useState(false)
    const [infoDialogProps, setInfoDialogProps] = useState({})
    const [warningMessage, setWarningMessage] = useState('')
    const [open, setOpen] = useState(false)

    const handleClose = () => {
        setOpen(false)
    }

    const handleOpen = () => {
        setOpen(true)
    }

    const nodeOutdatedMessage = (oldVersion, newVersion) => `Node version ${oldVersion} outdated\nUpdate to latest version ${newVersion}`

    const nodeVersionEmptyMessage = (newVersion) => `Node outdated\nUpdate to latest version ${newVersion}`

    const onDialogClicked = () => {
        const dialogProps = {
            data,
            inputParams: data.inputParams.filter((param) => param.additionalParams),
            confirmButtonName: 'Save',
            cancelButtonName: 'Cancel'
        }
        setDialogProps(dialogProps)
        setShowDialog(true)
    }

    useEffect(() => {
        const componentNode = canvas.componentNodes.find((nd) => nd.name === data.name)
        if (componentNode) {
            if (!data.version) {
                setWarningMessage(nodeVersionEmptyMessage(componentNode.version))
            } else if (data.version && componentNode.version > data.version) {
                setWarningMessage(nodeOutdatedMessage(data.version, componentNode.version))
            } else if (componentNode.badge === 'DEPRECATING') {
                setWarningMessage('This node will be deprecated in the next release. Change to a new node tagged with NEW')
            }
        }
    }, [canvas.componentNodes, data.name, data.version])

    return (
        <>
            <NodeCardWrapper
                content={false}
                sx={{
                    padding: 0,
                    borderColor: data.selected ? theme.palette.primary.main : theme.palette.text.secondary
                }}
                border={false}
            >
                <NodeTooltip
                    open={!canvas.canvasDialogShow && open}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    disableFocusListener={true}
                    title={
                        <div
                            style={{
                                background: 'transparent',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <IconButton
                                title='Duplicate'
                                onClick={() => {
                                    duplicateNode(data.id)
                                }}
                                sx={{ height: '35px', width: '35px', '&:hover': { color: theme?.palette.primary.main } }}
                                color={theme?.customization?.isDarkMode ? theme.colors?.paper : 'inherit'}
                            >
                                <IconCopy />
                            </IconButton>
                            <IconButton
                                title='Delete'
                                onClick={() => {
                                    deleteNode(data.id)
                                }}
                                sx={{ height: '35px', width: '35px', '&:hover': { color: 'red' } }}
                                color={theme?.customization?.isDarkMode ? theme.colors?.paper : 'inherit'}
                            >
                                <IconTrash />
                            </IconButton>
                            <IconButton
                                title='Info'
                                onClick={() => {
                                    setInfoDialogProps({ data })
                                    setShowInfoDialog(true)
                                }}
                                sx={{ height: '35px', width: '35px', '&:hover': { color: theme?.palette.secondary.main } }}
                                color={theme?.customization?.isDarkMode ? theme.colors?.paper : 'inherit'}
                            >
                                <IconInfoCircle />
                            </IconButton>
                        </div>
                    }
                    placement='right-start'
                >
                    <Box>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <Box style={{ width: 50, marginRight: 10, padding: 5 }}>
                                <div
                                    style={{
                                        ...theme.typography.commonAvatar,
                                        ...theme.typography.largeAvatar,
                                        borderRadius: '50%',
                                        backgroundColor: 'white',
                                        cursor: 'grab'
                                    }}
                                >
                                    <img
                                        style={{ width: '100%', height: '100%', padding: 5, objectFit: 'contain' }}
                                        src={`${baseURL}/api/v1/node-icon/${data.name}`}
                                        alt='Notification'
                                    />
                                </div>
                            </Box>
                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: '1rem',
                                        fontWeight: 500,
                                        mr: 2
                                    }}
                                >
                                    {data.label}
                                </Typography>
                            </Box>
                            {warningMessage && (
                                <>
                                    <div style={{ flexGrow: 1 }}></div>
                                    <Tooltip title={<span style={{ whiteSpace: 'pre-line' }}>{warningMessage}</span>} placement='top'>
                                        <IconButton sx={{ height: 35, width: 35 }}>
                                            <IconAlertTriangle size={35} color='orange' />
                                        </IconButton>
                                    </Tooltip>
                                </>
                            )}
                        </div>
                        {(data.inputAnchors.length > 0 || data.inputParams.length > 0) && (
                            <>
                                <Divider />
                                <Box sx={{ background: theme.palette.asyncSelect.main, p: 1 }}>
                                    <Typography
                                        sx={{
                                            fontWeight: 500,
                                            textAlign: 'center'
                                        }}
                                    >
                                        Inputs
                                    </Typography>
                                </Box>
                                <Divider />
                            </>
                        )}
                        {data.inputAnchors.map((inputAnchor, index) => (
                            <NodeInputHandler key={index} inputAnchor={inputAnchor} data={data} />
                        ))}
                        {data.inputParams
                            .filter((inputParam) => !inputParam.hidden)
                            .map((inputParam, index) => (
                                <NodeInputHandler key={index} inputParam={inputParam} data={data} />
                            ))}
                        {data.inputParams.find((param) => param.additionalParams) && (
                            <div
                                style={{
                                    textAlign: 'center',
                                    marginTop:
                                        data.inputParams.filter((param) => param.additionalParams).length ===
                                        data.inputParams.length + data.inputAnchors.length
                                            ? 20
                                            : 0
                                }}
                            >
                                <Button sx={{ borderRadius: 25, width: '90%', mb: 2 }} variant='outlined' onClick={onDialogClicked}>
                                    Additional Parameters
                                </Button>
                            </div>
                        )}

                        <Divider />
                        <Box sx={{ background: theme.palette.asyncSelect.main, p: 1 }}>
                            <Typography
                                sx={{
                                    fontWeight: 500,
                                    textAlign: 'center'
                                }}
                            >
                                Output
                            </Typography>
                        </Box>
                        <Divider />
                        {data.outputAnchors.map((outputAnchor, index) => (
                            <NodeOutputHandler key={index} outputAnchor={outputAnchor} data={data} />
                        ))}
                    </Box>
                </NodeTooltip>
            </NodeCardWrapper>
            <AdditionalParamsDialog
                show={showDialog}
                dialogProps={dialogProps}
                onCancel={() => setShowDialog(false)}
            ></AdditionalParamsDialog>
            <NodeInfoDialog show={showInfoDialog} dialogProps={infoDialogProps} onCancel={() => setShowInfoDialog(false)}></NodeInfoDialog>
        </>
    )
}

CanvasNode.propTypes = {
    data: PropTypes.object
}

export default CanvasNode
