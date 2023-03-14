function step(callback)
{
    var then = 0;
    function job(now)
    {
        now *= 0.001;                          // convert to seconds
        const deltaTime = now - then;          // compute time since last frame
        then = now;                            // remember time for next frame
        const fps = 1 / deltaTime;             // compute frames per second
        callback(fps.toFixed(1));
        requestAnimationFrame(job);
    }
    job()
}


export { step }