import { ContactResponse } from "@/types/contactDataType"

export async function getContact(
    token: string,
    currentPage: number,
    itemsPerPage: number
): Promise<ContactResponse> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/contact?page=${currentPage}&limit=${itemsPerPage}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    )
    if (!response.ok) {
        let errorMessage = "Failed to get contact"
        try {
            const errorData = await response.json()
            errorMessage = errorData.message || errorMessage
        } catch {
        }
        throw new Error(errorMessage)
    }

    const resData: ContactResponse = await response.json()
    return resData
}
