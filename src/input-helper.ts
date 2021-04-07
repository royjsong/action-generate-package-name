import * as core from '@actions/core'
import {Inputs} from './constants'
import {InputFields} from './input-fields'

export function getInputs(): InputFields {
    const fileName = core.getInput(Inputs.FILE_NAME, {required: true})
    const gitSha = core.getInput(Inputs.GIT_SHA, {required: false})

    const inputs = {
        fileName : fileName,
        gitSha: gitSha
    } as InputFields

    return inputs
}