export class healthCheckRepository{
    public getstatus(){
        return {
            status: "ok",
            database: "ok",
        }
    }
}