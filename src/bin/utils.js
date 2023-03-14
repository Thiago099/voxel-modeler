function step(callback)
{
    function job()
    {
        callback();
        requestAnimationFrame(job);
    }
    job()
}


export { step }