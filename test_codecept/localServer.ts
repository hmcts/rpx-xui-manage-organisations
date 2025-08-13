
import * as ejs from 'ejs';
import * as express from 'express';
import * as path from 'path';
import { app, logger } from '../api/application';
import errorHandler from '../api/lib/error.handler';
import axios from 'axios'

console.log('WE ARE USING server.ts on the box.');

/**
 * Used Server side
 */
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);

app.use(express.static(path.join(__dirname, '../dist/rpx-xui-manage-organisations', 'assets'), { index: false }));
app.use(express.static(path.join(__dirname, '../dist/rpx-xui-manage-organisations'), { index: false }));

/**
 * Used on server.ts only but should be fine to lift and shift to local.ts
 */
app.use('/*', (req, res) => {
    console.time(`GET: ${req.originalUrl}`);
    res.render('../dist/rpx-xui-manage-organisations/index', {
        providers: [{ provide: 'REQUEST', useValue: req }, { provide: 'RESPONSE', useValue: res }],
        req,
        res
    });
    console.timeEnd(`GET: ${req.originalUrl}`);
});

const port = process.env.PORT || 3000;

app.use(errorHandler);
// app.listen(port, () => logger.info(`Local server up at ${port}`));



class ApplicationServer {
    server: any
    async start() {

        this.server = await app.listen(3000);
        try {
            // const res = await axios.get('http://localhost:3000/auth/isAuthenticated')
            // console.log(res.data)


        } catch (err) {
            console.log(err)

        }


    }

    async stop() {
        return await this.server.close()
    }


}

const applicationServer = new ApplicationServer();

// applicationServer.start()
export default applicationServer;

