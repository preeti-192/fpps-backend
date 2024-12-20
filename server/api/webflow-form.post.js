import axios from "axios";

export default defineEventHandler(async (event) => {

    try {
        // Parse the incoming JSON body
        const body = await readBody(event);
        const currentDate = new Date().getTime();

        // Map Webflow form fields to ClickUp task fields
        const taskData = {
            name: `Form Submission: ${body.data["FirstName"]} ${body.data["LastName"]}`,
            description: `**Name**: ${body.data["FirstName"]} ${body.data["LastName"]}\n**Phone**: ${body.data["Phone"]}\n**Message**: ${body.data["Message"]}\n**Address**: ${body.data["address"]}\n**State**: ${body.data["state"]}`,
            status: "to do",
            assignees: [5496465],
            priority: 1,
            start_date: currentDate,
        };

        // Get the runtime config
        const {
            CLICKUP_TOKEN,
        } = useRuntimeConfig();

        // ClickUp API details from environment variables
        const listId = '901604956254';
        const apiToken = CLICKUP_TOKEN;
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
