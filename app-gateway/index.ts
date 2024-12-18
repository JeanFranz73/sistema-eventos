import express from 'express';
import cors from 'cors';

const app = express();

import eventRouter from './routes/event.routes';
import registrationRouter from './routes/registration.routes';

import { checkinParticipant, cancelRegistration, registerParticipant } from './api/events';
import { createUser } from './api/users';

app.use(cors());
app.use(express.json())

app.use(['/event', '/events'], eventRouter);

app.use(['/registrations', '/registration'], registrationRouter);

app.get('/', (req, res) => {
    res.send('Hello from app-gateway');
});

app.put('/checkin/:id', async (req, res) => {
    let id = parseInt(req.params.id);

    try {
        let response = await checkinParticipant(id, req.body.user_id);
        res.send(response.data);
    } catch (error: any) {
        if (error.response.status === 400) res.status(400).send("Invalid data")
        else res.status(500).send("Internal server error")
    }
})

app.put('/cancel/:id', async (req, res) => {
    let id = parseInt(req.params.id);

    try {
        let response = await cancelRegistration(id, req.body.user_id)
        res.send(response.data);
    } catch (error: any) {
        if (error.response.status === 400) res.status(400).send("Invalid data")
        else res.status(500).send("Internal server error")
    }
})

app.post('/upload', async (req, res) => {
    const { users, participants } = req.body;

    try {
        let unregisteredUsers = users.filter((user: any) => user.offline && user.offline === true)
        let unregisteredParticipants = participants.filter((participant: any) => participant.offline && participant.offline === true)

        await unregisteredUsers.map(async (user: any) => {
            let newUser = await createUser(user)
            unregisteredParticipants.map(async (participant: any) => {
                if (participant.user_id === user.id) {
                    participant.user_id = newUser.data.id
                }
            })
        })

        await unregisteredParticipants.map(async (participant: any) => {
            await registerParticipant(participant.event_id, participant.user_id, participant.status)
        })
    } catch (error: any) {
        if (error.response.status === 400) res.status(400).send("Invalid data")
        else res.status(500).send("Internal server error")
    }
})

app.listen(3000, () => {
    console.log('App gateway listening on port 3000');
});