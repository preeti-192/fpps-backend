import axios from "axios";

export default defineEventHandler(async (event) => {
    try {
        // Parse the incoming JSON body
        const body = await readBody(event);
        const currentDate = new Date().getTime();

        // Map Webflow form fields to ClickUp task fields
        const taskData = {
            name: `Form Submission: ${body.data["Name"]}`,
            description: `**Email**: ${body.data["Email"]}\n**Phone**: ${body.data["Phone"]}\n**Message**: ${body.data["Message"]}`,
            status: "to do",
            assignees: [5496465],
            priority: 2,
            start_date: currentDate,
            due_date: currentDate,
        };

        // ClickUp API details from environment variables
        const listId = '901604956254';
        const apiToken = 'pk_55289378_CMDSU7G0B4GOPHB83WVV92JOL73ELHDC';

        // Send data to ClickUp
        await axios.post(
            `https://api.clickup.com/api/v2/list/${listId}/task`,
            taskData,
            {
                headers: {
                    Authorization: apiToken,
                    "Content-Type": "application/json",
                },
            }
        );

        // Return success response
        return { success: true, message: "Task created in ClickUp!" };
    } catch (error) {
        console.error("Error creating task in ClickUp:", error.response?.data || error.message);
        throw createError({ statusCode: 500, message: "Error creating task in ClickUp." });
    }
});
