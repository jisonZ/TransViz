import { INode, INodeData, INodeParams, INodeMatrix } from '../../../src/Interface'

class embedding implements INodeMatrix {
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
        this.label = 'Embedding'
        this.name = 'embedding'
        this.version = 1.0
        this.type = 'embedding'
        this.category = 'Transformer'
        this.icon = 'embedding.svg'
        this.description = 'Embedding'
        this.baseClasses = ['embedding']
        this.showMatrix = true
        this.inputs = [
            {
                label: 'Text',
                name: 'text',
                type: 'options',
                placeholder: 'Type your text here',
                options: [{ label: 'bert-embedding', name: 'bert-embedding' }],
                default: 'bert-embedding'
            }
        ]
    }
}

module.exports = { nodeClass: embedding }
