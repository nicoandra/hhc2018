validateSequence = (e) => {
    if (!e)
        return g;
    if ("" == `${e}`)
        return g;

    if (!/((?:AT|TA|GC|CG){60})/i.test(e))
        return g;

    const t = b.getSize();
    if (e.length / 8 !== t)
        return g;

    const n = b.decodeDNASequence(e);

    return !!Object(i.filter)(n, (e,t)=>{
        if ("size" === t)
            return 0 > e || e >= d.length;
        if (Object(i.includes)(Object.keys(A), t))
            return 0 > e || e >= A[t].count;
        const n = Object(i.find)(c, {
            name: t
        });
        return !!n && (0 > e || e > parseInt(Array(n.size + 1).join("1"), 2).toString(10))
    }
    ).length && x
};
