<script>
    export let label, small, optional = false
</script>

<label class:small>
    <slot></slot>
    {#if label}
        <span>{label}{optional ? " (optional)" : ""}</span>
    {/if}
</label>

<style>
    label {
        display: block;
        margin-bottom: .5rem
    }

    span {
        font-size: .9rem;
        opacity: .6;
    }

    label.small {
        margin-bottom: .15rem
    }
</style>