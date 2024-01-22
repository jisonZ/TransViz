import { INode, INodeData, INodeParams, INodeMatrix } from '../../../src/Interface'

class textInput implements INodeMatrix {
    label: string
    name: string
    version: number
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]
    showMatrix: boolean

    constructor() {
        this.label = 'Text Input'
        this.name = 'textInput'
        this.version = 1.0
        this.type = 'textInput'
        this.category = 'Transformer'
        this.icon = 'textinput.svg'
        this.description = 'Text input'
        this.baseClasses = ['textInput']
        this.showMatrix = false
        this.inputs = [
            {
                label: 'Text',
                name: 'text',
                type: 'string',
                placeholder: 'Type your text here',
                rows: 5,
                list: true,
                acceptVariable: true
            }
        ]
    }
}

module.exports = { nodeClass: textInput }
