import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { AIPluginTool } from 'langchain/tools'
import { getBaseClasses } from '../../../src/utils'

class TestAIPlugin implements INode {
    label: string
    name: string
    version: number
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs?: INodeParams[]

    constructor() {
        this.label = 'TestAIPlugin'
        this.name = 'TestAIPlugin'
        this.version = 1.0
        this.type = 'TestAIPlugin'
        this.icon = 'aiplugin.svg'
        this.category = 'Tools'
        this.description = 'Execute actions using ChatGPT Plugin Url'
        this.baseClasses = [this.type, ...getBaseClasses(TestAIPlugin)]
        this.inputs = [
            {
                label: 'Plugin Url',
                name: 'pluginUrl',
                type: 'string',
                placeholder: 'https://www.klarna.com/.well-known/ai-plugin.json'
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const pluginUrl = nodeData.inputs?.pluginUrl as string
        const aiplugin = await AIPluginTool.fromPluginUrl(pluginUrl)

        return aiplugin
    }
}

module.exports = { nodeClass: TestAIPlugin }
