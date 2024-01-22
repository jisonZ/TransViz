import { INode, INodeData, INodeParams, INodeMatrix } from '../../../src/Interface'

class tokenizer implements INodeMatrix {
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
        this.label = 'Tokenizer'
        this.name = 'tokenizer'
        this.version = 1.0
        this.type = 'tokenizer'
        this.category = 'Transformer'
        this.icon = 'tokenizer.svg'
        this.description = 'Tokenizer'
        this.baseClasses = ['tokenizer']
        this.showMatrix = false
        this.inputs = [
            {
                label: 'Text',
                name: 'text',
                type: 'options',
                placeholder: 'Type your text here',
                options: [{ label: 'bert-tokenizer', name: 'bert-tokenizer' }],
                default: 'bert-tokenizer'
            }
        ]
    }
}

module.exports = { nodeClass: tokenizer }
