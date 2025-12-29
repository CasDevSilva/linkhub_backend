import { createDBLink, deleteDBLink, getDBLink, updateDBLink } from "../utils/database"

export const getLink = async (request, response)  =>{
    try {
        let mArrLinks = await getDBLink(request.user.id);

        response.status(200);
        return response.json({
            links: mArrLinks
        });
    } catch(error) {
        response.status(400)
        return response.json({
            error: error.message
        })
    }
}

export const createLink = async (request, response) =>{
    try {
        request.body.userId = request.user.id;

        let mObjLink = await createDBLink(request.body)

        response.status(200);
        return response.json(mObjLink);
    } catch(error) {
        response.status(400)
        return response.json({
            error: error.message
        })
    }
}

export const updateLink = async (request, response) => {
    try {
        const mObjUpdLink = await updateDBLink(request.user.id, request.params.id, request.body)

        response.status(200);
        return response.json(mObjUpdLink);
    } catch(error) {
        response.status(400)
        return response.json({
            error: error.message
        })
    }
}

export const deleteLink = async (request, response)  => {
    try {
        const mObjDelLink = await deleteDBLink(request.user.id, request.params.id)

        response.status(200);
        return response.json(mObjDelLink);
    } catch(error) {
        response.status(400)
        return response.json({
            error: error.message
        });
    }
}

// pending
export const reorderLinks = (request, response) => {
    try {

    } catch(error) {
        response.status(400)
        return response.json({
            error: error.message
        })
    }
}