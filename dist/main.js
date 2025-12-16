"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.getHttpAdapter().get('/', (req, res) => {
        res.json({
            message: 'Mad3oom API is running!',
            status: 'ok',
            database: 'SQLite connected',
            time: new Date().toISOString()
        });
    });
    await app.listen(4000, "0.0.0.0");
    console.log('🚀 Server running at http://localhost:4000');
}
bootstrap();
//# sourceMappingURL=main.js.map