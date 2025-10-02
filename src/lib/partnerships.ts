import { PartnershipData, PartnershipResponse, SinglePartnershipResponse } from "@/types/partnershipDataType"

export async function getPartnership(
    token: string,
    currentPage: number,
    itemsPerPage: number
): Promise<PartnershipResponse> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/partnership?page=${currentPage}&limit=${itemsPerPage}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    )

    if (!response.ok) {
        let errorMessage = "Failed to get partnership"
        try {
            const errorData = await response.json()
            errorMessage = errorData.message || errorMessage
        } catch {
        }
        throw new Error(errorMessage)
    }

    const resData: PartnershipResponse = await response.json()
    return resData
}

export async function deletePartnership(token: string, id: string) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/partnership/${id}`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    )

    const resData = await response.json()
    if (!response.ok) throw new Error(resData.message || "Failed to delete partnership")
    return resData
}

export async function updatePartnership(token: string, id: string, payload: PartnershipData) {
    const formData = new FormData()
    formData.append("title", payload.title)
    formData.append("description", payload.description)
    if (payload.image && payload.image) {
        formData.append("image", payload.image)
    }
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/partnership/${id}`,
        {
            method: "PUT",
            headers: {

                Authorization: `Bearer ${token}`,
            },
            body: formData,
        }
    )

    const resData = await response.json()
    if (!response.ok) throw new Error(resData.message || "Failed to update partnership")
    return resData
}

export async function createPartnership(token: string, payload: PartnershipData) {
    const formData = new FormData()
    formData.append("title", payload.title)
    formData.append("description", payload.description)
    if (payload.image && payload.image) {
        formData.append("image", payload.image)
    }
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/partnership/create`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        }
    )
    const resData = await response.json()
    if (!response.ok) throw new Error(resData.message || "Failed to create partnership")
    return resData
}

export async function getSingelPartnership(
    token: string,
    id: string
): Promise<SinglePartnershipResponse> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/partnership/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    )

    if (!response.ok) {
        let errorMessage = "Failed to get partnership"
        try {
            const errorData = await response.json()
            errorMessage = errorData.message || errorMessage
        } catch {
        }
        throw new Error(errorMessage)
    }

    const resData: SinglePartnershipResponse = await response.json()
    return resData
}
